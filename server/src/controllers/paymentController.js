const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");
const { createNotification } = require("../services/notificationService");
const {
  getOrCreatePaymentOrder,
  verifyRazorpaySignature,
  capturePaymentAndGenerateInvoice,
  hasRealRazorpayKeys,
} = require("../services/paymentProcessingService");
const { User } = require("../models/User");

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (req.user.role === "STORE_MANAGER" && String(order.storeManager) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only create payment orders for your own orders");
  }

  if (order.paymentStatus === "Paid") {
    res.status(400);
    throw new Error("Order is already paid");
  }

  const paymentOrder = await getOrCreatePaymentOrder({
    order,
    userId: req.user._id,
  });

  successResponse(
    res,
    paymentOrder.reused ? "Payment order already exists" : "Payment order created",
    {
      razorpayOrder: paymentOrder.razorpayOrder,
      payment: paymentOrder.payment,
      razorpayKeyId: hasRealRazorpayKeys() ? process.env.RAZORPAY_KEY_ID : "",
    }
  );
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const payment = await Payment.findById(paymentId).populate("order");
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  if (req.user.role === "STORE_MANAGER" && String(payment.user) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only verify your own payments");
  }

  if (payment.status === "captured") {
    const order = await Order.findById(payment.order._id).populate("storeManager");
    const invoice = await Invoice.findOne({ order: order._id });
    return successResponse(res, "Payment already verified", { payment, order, invoice });
  }

  const isValid = verifyRazorpaySignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  if (!isValid) {
    payment.status = "failed";
    await payment.save();
    res.status(400);
    throw new Error("Payment verification failed");
  }

  const order = await Order.findById(payment.order._id).populate("storeManager");
  const invoice = await capturePaymentAndGenerateInvoice({
    payment,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    order,
  });

  const admins = await User.find({ role: "ADMIN" });
  const warehouseManagers = await User.find({ role: "WAREHOUSE_MANAGER" });

  await Promise.all([
    ...admins.map((admin) =>
      createNotification({
        recipient: admin._id,
        title: "New payment received",
        message: `Payment captured for order ${order._id}.`,
        metadata: { orderId: order._id, paymentId: payment._id },
      })
    ),
    ...warehouseManagers.map((manager) =>
      createNotification({
        recipient: manager._id,
        title: "Invoice ready",
        message: `Invoice ${invoice.invoiceNumber} is available.`,
        metadata: { invoiceId: invoice._id },
      })
    ),
  ]);

  successResponse(res, "Payment verified", { payment, order, invoice });
});

const getPayments = asyncHandler(async (req, res) => {
  let filter = req.user.role === "ADMIN" ? {} : { user: req.user._id };
  if (req.user.role === "SUPPLIER") {
    const orders = await Order.find({ supplier: req.user._id }).select("_id");
    filter = { order: { $in: orders.map((order) => order._id) } };
  }
  const payments = await Payment.find(filter)
    .populate("order")
    .populate("user", "name email role")
    .sort({ createdAt: -1 });
  successResponse(res, "Payments fetched", payments);
});

module.exports = { createRazorpayOrder, verifyPayment, getPayments };
