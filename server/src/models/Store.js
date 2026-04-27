const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    location: { type: String, required: true },
    type: { type: String, default: "Retail", trim: true },
    address: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    gstNumber: { type: String, default: "", trim: true },
    contactNumber: { type: String, default: "", trim: true },
    logoUrl: { type: String, default: "" },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema);
