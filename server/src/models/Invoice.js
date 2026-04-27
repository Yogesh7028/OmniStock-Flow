const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    items: [
      {
        productName: String,
        quantity: Number,
        price: Number,
        total: Number,
      },
    ],
    subtotal: Number,
    taxAmount: Number,
    totalAmount: Number,
    paymentStatus: { type: String, default: "Paid" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
