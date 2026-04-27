const crypto = require("crypto");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const razorpay = require("../config/razorpay");
const { generateInvoiceNumber } = require("./invoiceService");

const hasRealRazorpayKeys = () =>
  Boolean(
    process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      !String(process.env.RAZORPAY_KEY_ID).includes("placeholder") &&
      !String(process.env.RAZORPAY_KEY_SECRET).includes("placeholder")
  );

const isMockOrderId = (orderId) => String(orderId || "").startsWith("mock_order_");

const getOrCreatePaymentOrder = async ({ order, userId }) => {
  const existingCreatedPayment = await Payment.findOne({
    order: order._id,
    status: "created",
  }).sort({ createdAt: -1 });

  if (existingCreatedPayment) {
    const existingIsMock = isMockOrderId(existingCreatedPayment.razorpayOrderId);

    if (!(existingIsMock && hasRealRazorpayKeys())) {
      return {
        razorpayOrder: {
          id: existingCreatedPayment.razorpayOrderId,
          amount: Math.round(order.totalAmount * 100),
          currency: "INR",
          mock: existingIsMock,
        },
        payment: existingCreatedPayment,
        reused: true,
      };
    }
  }

  let razorpayOrder = null;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: `order_${order._id}`,
    });
  } catch (error) {
    razorpayOrder = {
      id: `mock_order_${Date.now()}`,
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: `order_${order._id}`,
      mock: true,
    };
  }

  if (existingCreatedPayment) {
    existingCreatedPayment.razorpayOrderId = razorpayOrder.id;
    existingCreatedPayment.status = "created";
    await existingCreatedPayment.save();

    return { razorpayOrder, payment: existingCreatedPayment, reused: true };
  }

  const payment = await Payment.create({
    order: order._id,
    user: userId,
    amount: order.totalAmount,
    razorpayOrderId: razorpayOrder.id,
    status: "created",
  });

  return { razorpayOrder, payment, reused: false };
};

const verifyRazorpaySignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const hasLiveRazorpayPayload = razorpayPaymentId && razorpaySignature;
  const hasRealSecret =
    process.env.RAZORPAY_KEY_SECRET &&
    !String(process.env.RAZORPAY_KEY_SECRET).includes("placeholder");

  if (!hasLiveRazorpayPayload || !hasRealSecret) return true;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return generatedSignature === razorpaySignature;
};

const capturePaymentAndGenerateInvoice = async ({
  payment,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  order,
}) => {
  payment.razorpayOrderId = razorpayOrderId || payment.razorpayOrderId;
  payment.razorpayPaymentId = razorpayPaymentId || `mock_payment_${Date.now()}`;
  payment.razorpaySignature = razorpaySignature || "mock_signature";
  payment.status = "captured";
  await payment.save();

  order.paymentStatus = "Paid";
  order.confirmedAt = order.confirmedAt || new Date();
  await order.save();

  const existingInvoice = await Invoice.findOne({ order: order._id });
  const invoice =
    existingInvoice ||
    (await Invoice.create({
      invoiceNumber: generateInvoiceNumber(),
      order: order._id,
      payment: payment._id,
      customerName: order.storeManager.name,
      customerEmail: order.storeManager.email,
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })),
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      totalAmount: order.totalAmount,
      paymentStatus: "Paid",
    }));

  return invoice;
};

module.exports = {
  getOrCreatePaymentOrder,
  verifyRazorpaySignature,
  capturePaymentAndGenerateInvoice,
};
