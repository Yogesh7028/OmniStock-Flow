const Order = require("../models/Order");
const Product = require("../models/Product");
const { User } = require("../models/User");
const Warehouse = require("../models/Warehouse");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");
const { createNotification } = require("./notificationController");
const Store = require("../models/Store");
const { generateInvoiceNumber } = require("../services/invoiceService");
const { notifyLowStockIfNeeded } = require("./stockController");

const getOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "STORE_MANAGER") filter.storeManager = req.user._id;
  if (req.user.role === "SUPPLIER") filter.supplier = req.user._id;

  const orders = await Order.find(filter)
    .populate("storeManager", "name email")
    .populate("supplier", "name email")
    .populate("store", "name code")
    .populate("warehouse", "name code location")
    .populate("items.product", "name sku imageUrl")
    .sort({ createdAt: -1 });

  successResponse(res, "Orders fetched", orders);
});

const createOrder = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
    res.status(400);
    throw new Error("At least one order item is required");
  }

  let store = null;
  let supplier = null;
  let warehouse = null;
  if (req.body.store) {
    store = await Store.findById(req.body.store);
    if (!store) {
      res.status(404);
      throw new Error("Store not found");
    }
  }

  if (req.body.warehouse) {
    warehouse = await Warehouse.findById(req.body.warehouse);
    if (!warehouse) {
      res.status(404);
      throw new Error("Warehouse not found");
    }
  } else if (store?.warehouse) {
    warehouse = await Warehouse.findById(store.warehouse);
  }

  if (req.body.supplier) {
    supplier = await User.findById(req.body.supplier);
    if (!supplier || supplier.role !== "SUPPLIER") {
      res.status(404);
      throw new Error("Supplier not found");
    }
  }

  const items = await Promise.all(
    req.body.items.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) throw new Error("Product not found");
      if (!item.quantity || Number(item.quantity) < 1) {
        throw new Error("Item quantity must be at least 1");
      }
      return {
        product: product._id,
        productName: product.name,
        quantity: Number(item.quantity),
        price: product.price,
      };
    })
  );

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = Number(process.env.GST_PERCENTAGE || 18) / 100;
  const taxAmount = Number((subtotal * taxRate).toFixed(2));
  const totalAmount = subtotal + taxAmount;

  const order = await Order.create({
    storeManager: req.user._id,
    supplier: supplier?._id || null,
    store: store?._id || null,
    warehouse: warehouse?._id || null,
    items,
    subtotal,
    taxAmount,
    totalAmount,
    paymentMethod: req.body.paymentMethod || "RAZORPAY",
    paymentStatus: req.body.paymentStatus || "Pending",
  });

  let invoice = null;
  if (order.paymentMethod === "CASH") {
    const payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      amount: order.totalAmount,
      provider: "Cash",
      status: "captured",
    });
    order.paymentStatus = "Paid";
    order.confirmedAt = new Date();
    await order.save();
    invoice = await createInvoiceForOrder({ order: await order.populate("storeManager"), payment });
  }

  const admins = await User.find({ role: "ADMIN" });
  const warehouseManagers = await User.find({ role: "WAREHOUSE_MANAGER" });
  await Promise.all(
    [
      ...admins.map((admin) =>
        createNotification({
          recipient: admin._id,
          title: "New order placed",
          message: `Order ${order._id} has been created.`,
          metadata: { orderId: order._id },
        })
      ),
      ...warehouseManagers.map((manager) =>
        createNotification({
          recipient: manager._id,
          title: "Order awaiting warehouse visibility",
          message: `Order ${order._id} has been placed and will need stock/invoice visibility.`,
          metadata: { orderId: order._id },
        })
      ),
    ]
  );

  if (order.supplier) {
    await createNotification({
      recipient: order.supplier,
      title: "Assigned order",
      message: `A new order ${order._id} needs fulfillment.`,
      metadata: { orderId: order._id },
    });
  }

  successResponse(res, "Order created", invoice ? { order, invoice } : order, 201);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (req.user.role === "SUPPLIER" && String(order.supplier) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only update your assigned orders");
  }

  order.status = req.body.status;

  if (order.status === "Delivered") {
    await deductDeliveredOrderStock(order);
  }

  await order.save();

  await createNotification({
    recipient: order.storeManager,
    title: "Order status updated",
    message: `Order ${order._id} is now ${order.status}.`,
    metadata: { orderId: order._id },
  });

  const populatedOrder = await Order.findById(order._id)
    .populate("storeManager", "name email")
    .populate("supplier", "name email")
    .populate("store", "name code")
    .populate("warehouse", "name code location")
    .populate("items.product", "name sku imageUrl");

  successResponse(res, "Order status updated", populatedOrder);
});

const receiveSupplierDelivery = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.warehouseReceived) {
    res.status(400);
    throw new Error("Supplier delivery already received");
  }

  if (!["Shipped", "Dispatched", "Delivered"].includes(order.status)) {
    res.status(400);
    throw new Error("Only shipped, dispatched, or delivered orders can be received");
  }

  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { warehouseStock: item.quantity },
      })
    )
  );

  order.warehouseReceived = true;
  order.receivedAt = new Date();
  order.receivedBy = req.user._id;
  await order.save();

  await createNotification({
    recipient: order.storeManager,
    title: "Warehouse received supplier delivery",
    message: `Order ${order._id} has been received into warehouse stock.`,
    metadata: { orderId: order._id },
  });

  const populatedOrder = await Order.findById(order._id)
    .populate("storeManager", "name email")
    .populate("supplier", "name email")
    .populate("store", "name code")
    .populate("warehouse", "name code location")
    .populate("items.product", "name sku imageUrl");

  successResponse(res, "Supplier delivery received", populatedOrder);
});

const createInvoiceForOrder = async ({ order, payment }) => {
  const existingInvoice = await Invoice.findOne({ order: order._id });
  if (existingInvoice) return existingInvoice;

  return Invoice.create({
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
  });
};

const deductDeliveredOrderStock = async (order) => {
  if (order.stockDeducted) return;
  if (order.paymentStatus !== "Paid") {
    throw new Error("Stock can be deducted only after payment/order confirmation");
  }

  let warehouse = order.warehouse ? await Warehouse.findById(order.warehouse) : null;
  if (!warehouse && order.store) {
    const store = await Store.findById(order.store);
    warehouse = store?.warehouse ? await Warehouse.findById(store.warehouse) : null;
  }

  if (!warehouse) {
    throw new Error("Assign a warehouse before completing delivery");
  }

  for (const item of order.items) {
    const stockItem = warehouse.stock.find(
      (entry) => String(entry.product) === String(item.product)
    );
    if (!stockItem || stockItem.quantity < item.quantity) {
      throw new Error(`Insufficient warehouse stock for ${item.productName}`);
    }
  }

  for (const item of order.items) {
    const stockItem = warehouse.stock.find(
      (entry) => String(entry.product) === String(item.product)
    );
    stockItem.quantity -= item.quantity;
    const product = await Product.findById(item.product);
    if (product) {
      product.warehouseStock = Math.max(0, Number(product.warehouseStock || 0) - item.quantity);
      product.storeStock = Math.max(0, Number(product.storeStock || 0) - item.quantity);
      await product.save();
      await notifyLowStockIfNeeded({ product, warehouse, quantity: stockItem.quantity });
    }
  }

  order.warehouse = warehouse._id;
  order.stockDeducted = true;
  order.deliveredAt = new Date();
  await warehouse.save();
};

module.exports = { getOrders, createOrder, updateOrderStatus, receiveSupplierDelivery };
