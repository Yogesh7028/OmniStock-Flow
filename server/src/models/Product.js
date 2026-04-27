const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    brand: { type: String, default: "", trim: true },
    features: [{ type: String, trim: true }],
    price: { type: Number, required: true, min: 0 },
    warehouseStock: { type: Number, default: 0 },
    storeStock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    imageUrl: { type: String, default: "" },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
