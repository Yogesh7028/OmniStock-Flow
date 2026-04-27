const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    storeManager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", default: null },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", default: null },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Processing", "Packed", "Shipped", "Dispatched", "Delivered"],
      default: "Pending",
    },
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["RAZORPAY", "CASH"],
      default: "RAZORPAY",
    },
    confirmedAt: { type: Date, default: null },
    stockDeducted: { type: Boolean, default: false },
    deliveredAt: { type: Date, default: null },
    warehouseReceived: { type: Boolean, default: false },
    receivedAt: { type: Date, default: null },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
