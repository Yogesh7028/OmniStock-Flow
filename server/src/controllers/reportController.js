const { User } = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const StockTransfer = require("../models/StockTransfer");
const Warehouse = require("../models/Warehouse");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const getDashboardReport = asyncHandler(async (req, res) => {
  const [users, products, orders, payments, invoices, transfers, warehouses] = await Promise.all([
    User.countDocuments(),
    Product.find(),
    Order.find(),
    Payment.find(),
    Invoice.countDocuments(),
    StockTransfer.countDocuments(),
    Warehouse.find()
      .populate("manager", "name email")
      .populate("stock.product", "name category brand lowStockThreshold"),
  ]);

  const revenue = payments
    .filter((payment) => payment.status === "captured")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const lowStockProducts = products.filter(
    (product) => product.warehouseStock + product.storeStock <= product.lowStockThreshold
  );

  const warehouseStockReport = warehouses.map((warehouse) => {
    const stock = warehouse.stock.map((item) => ({
      product: item.product,
      quantity: Number(item.quantity || 0),
    }));

    return {
      _id: warehouse._id,
      name: warehouse.name,
      code: warehouse.code,
      location: warehouse.location,
      manager: warehouse.manager,
      stock,
      totalStock: stock.reduce((sum, item) => sum + item.quantity, 0),
      lowStockItems: stock.filter(
        (item) =>
          item.product &&
          item.quantity <= Number(item.product.lowStockThreshold || 0)
      ).length,
    };
  });

  successResponse(res, "Dashboard report fetched", {
    totals: {
      users,
      products: products.length,
      orders: orders.length,
      payments: payments.length,
      invoices,
      transfers,
      revenue,
      warehouseStock: warehouseStockReport.reduce((sum, warehouse) => sum + warehouse.totalStock, 0),
    },
    lowStockProducts,
    warehouseStockReport,
    pendingDeliveries: orders.filter((order) => order.status !== "Delivered").length,
    recentOrders: orders.slice(-5).reverse(),
  });
});

module.exports = { getDashboardReport };
