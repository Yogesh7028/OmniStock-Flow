const { User } = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const StockTransfer = require("../models/StockTransfer");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const getDashboardReport = asyncHandler(async (req, res) => {
  const [users, products, orders, payments, invoices, transfers] = await Promise.all([
    User.countDocuments(),
    Product.find(),
    Order.find(),
    Payment.find(),
    Invoice.countDocuments(),
    StockTransfer.countDocuments(),
  ]);

  const revenue = payments
    .filter((payment) => payment.status === "captured")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const lowStockProducts = products.filter(
    (product) => product.warehouseStock + product.storeStock <= product.lowStockThreshold
  );

  successResponse(res, "Dashboard report fetched", {
    totals: {
      users,
      products: products.length,
      orders: orders.length,
      payments: payments.length,
      invoices,
      transfers,
      revenue,
    },
    lowStockProducts,
    pendingDeliveries: orders.filter((order) => order.status !== "Delivered").length,
    recentOrders: orders.slice(-5).reverse(),
  });
});

module.exports = { getDashboardReport };
