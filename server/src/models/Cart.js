const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", default: null },
        quantity: { type: Number, required: true, min: 1, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
