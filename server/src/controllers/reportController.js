const { User } = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const StockTransfer = require("../models/StockTransfer");
const Warehouse = require("../models/Warehouse");
const Store = require("../models/Store");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const monthLabel = (date) =>
  new Date(date).toLocaleString("en-US", { month: "short", year: "2-digit" });

const getLastMonths = (count = 6) => {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - index - 1), 1);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: monthLabel(date),
    };
  });
};

const getDashboardReport = asyncHandler(async (req, res) => {
  const [userCount, storeCount, users, products, orders, payments, invoices, transfers, warehouses] = await Promise.all([
    User.countDocuments(),
    Store.countDocuments(),
    User.find().sort({ createdAt: -1 }).limit(5).select("name email role phone isVerified createdAt"),
    Product.find().sort({ createdAt: -1 }),
    Order.find()
      .sort({ createdAt: -1 })
      .populate("storeManager", "name email")
      .populate("store", "name code"),
    Payment.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("order", "status totalAmount"),
    Invoice.countDocuments(),
    StockTransfer.find().sort({ createdAt: -1 }).populate("product", "name sku category"),
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
  const pendingPayments = payments.filter((payment) => payment.status === "created");
  const recentOrders = orders.slice(0, 5);
  const recentPayments = payments.slice(0, 5);
  const recentUsers = users;

  const months = getLastMonths(6);
  const monthlyRevenue = months.map((month) => ({
    month: month.label,
    revenue: payments
      .filter((payment) => {
        const date = new Date(payment.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        return payment.status === "captured" && key === month.key;
      })
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
  }));

  const orderStatuses = ["Pending", "Processing", "Packed", "Shipped", "Dispatched", "Delivered"];
  const ordersByStatus = orderStatuses.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));

  const stockMovement = months.map((month) => ({
    month: month.label,
    quantity: transfers
      .filter((transfer) => {
        const date = new Date(transfer.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        return key === month.key;
      })
      .reduce((sum, transfer) => sum + Number(transfer.quantity || 0), 0),
  }));

  const topSellingMap = orders.reduce((acc, order) => {
    order.items.forEach((item) => {
      const key = item.productName || "Unknown product";
      if (!acc[key]) acc[key] = { name: key, quantity: 0, revenue: 0 };
      acc[key].quantity += Number(item.quantity || 0);
      acc[key].revenue += Number(item.quantity || 0) * Number(item.price || 0);
    });
    return acc;
  }, {});
  const topSellingProducts = Object.values(topSellingMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

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
      users: userCount,
      products: products.length,
      warehouses: warehouses.length,
      stores: storeCount,
      orders: orders.length,
      payments: payments.length,
      invoices,
      transfers: transfers.length,
      revenue,
      pendingPayments: pendingPayments.length,
      pendingPaymentAmount: pendingPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      lowStockAlerts: lowStockProducts.length,
      warehouseStock: warehouseStockReport.reduce((sum, warehouse) => sum + warehouse.totalStock, 0),
    },
    lowStockProducts,
    warehouseStockReport,
    charts: {
      monthlyRevenue,
      ordersByStatus,
      stockMovement,
      topSellingProducts,
    },
    pendingDeliveries: orders.filter((order) => order.status !== "Delivered").length,
    recentOrders,
    recentPayments,
    recentUsers,
  });
});

module.exports = { getDashboardReport };
