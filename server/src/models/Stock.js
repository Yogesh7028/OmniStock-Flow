const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", default: null },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", default: null },
    quantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Stock || mongoose.model("Stock", stockSchema);
