const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const roles = ["ADMIN", "STORE_MANAGER", "WAREHOUSE_MANAGER", "SUPPLIER"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: roles, default: "STORE_MANAGER" },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function preSave(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = {
  User: mongoose.model("User", userSchema),
  USER_ROLES: roles,
};
