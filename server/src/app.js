const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const storeRoutes = require("./routes/storeRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const stockTransferRoutes = require("./routes/stockTransferRoutes");
const stockRoutes = require("./routes/stockRoutes");
const transferRoutes = require("./routes/transferRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const cartRoutes = require("./routes/cartRoutes");
const supportTicketRoutes = require("./routes/supportTicketRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Health check is useful for local verification and deployment readiness probes.
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "OmniStock Flow API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/stock-transfer", stockTransferRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/support-tickets", supportTicketRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
