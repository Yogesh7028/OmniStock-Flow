const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    location: { type: String, required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    stock: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Warehouse", warehouseSchema);
