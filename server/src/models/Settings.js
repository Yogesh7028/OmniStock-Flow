const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      enum: ["GLOBAL", "USER"],
      required: true,
      default: "USER",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    account: {
      otpEnabled: { type: Boolean, default: true },
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      lowStockAlerts: { type: Boolean, default: true },
      orderAlerts: { type: Boolean, default: true },
      paymentAlerts: { type: Boolean, default: true },
    },
    appearance: {
      darkMode: { type: Boolean, default: false },
      theme: { type: String, default: "teal" },
      density: { type: String, default: "comfortable" },
    },
    organization: {
      companyName: { type: String, default: "OmniStock Flow" },
      gstNumber: { type: String, default: "" },
      logoUrl: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    rolePermissions: {
      ADMIN: [{ type: String }],
      WAREHOUSE_MANAGER: [{ type: String }],
      STORE_MANAGER: [{ type: String }],
      SUPPLIER: [{ type: String }],
    },
    inventory: {
      lowStockLimit: { type: Number, default: 10 },
      stockAlerts: { type: Boolean, default: true },
      autoReorder: { type: Boolean, default: false },
    },
    payment: {
      razorpayKeyId: { type: String, default: "" },
      razorpayEnabled: { type: Boolean, default: true },
      upiEnabled: { type: Boolean, default: true },
      cardEnabled: { type: Boolean, default: true },
      cashEnabled: { type: Boolean, default: true },
    },
    invoice: {
      gstPercent: { type: Number, default: 18 },
      invoicePrefix: { type: String, default: "INV" },
      logoUrl: { type: String, default: "" },
      footerNote: { type: String, default: "Thank you for using OmniStock Flow." },
    },
    security: {
      sessionTimeoutMinutes: { type: Number, default: 30 },
      loginActivity: { type: Boolean, default: true },
      notifyNewLogin: { type: Boolean, default: true },
    },
    integration: {
      smtpHost: { type: String, default: "" },
      smtpPort: { type: Number, default: 587 },
      smtpUser: { type: String, default: "" },
      cloudinaryCloudName: { type: String, default: "" },
      cloudinaryApiKey: { type: String, default: "" },
      razorpayKeyId: { type: String, default: "" },
    },
    data: {
      csvExport: { type: Boolean, default: true },
      csvImport: { type: Boolean, default: false },
      lastExportAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

settingsSchema.index({ scope: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Settings", settingsSchema);
