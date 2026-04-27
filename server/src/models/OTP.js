const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    code: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["REGISTER", "RESET_PASSWORD"],
      required: true,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", otpSchema);
