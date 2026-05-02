const mongoose = require("mongoose");

const stockTransferSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["GENERAL_TO_WAREHOUSE", "WAREHOUSE_TO_STORE", "WAREHOUSE_TO_WAREHOUSE"],
      required: true,
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    sourceWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", default: null },
    destinationWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", default: null },
    destinationStore: { type: mongoose.Schema.Types.ObjectId, ref: "Store", default: null },
    quantity: { type: Number, required: true, min: 1 },
    transferredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockTransfer", stockTransferSchema);
