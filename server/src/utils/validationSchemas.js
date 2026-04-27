const { USER_ROLES } = require("../models/User");

const registerSchema = {
  name: { required: true, minLength: 2 },
  email: { required: true, type: "email" },
  phone: { required: true, minLength: 8 },
  password: { required: true, minLength: 8 },
  role: { enum: USER_ROLES },
  storeName: { minLength: 2 },
  storeType: { minLength: 2 },
  storeAddress: { minLength: 2 },
  city: { minLength: 2 },
  gstNumber: {},
  storeContactNumber: { minLength: 8 },
};

const loginSchema = {
  email: { required: true, type: "email" },
  password: { required: true, minLength: 8 },
};

const forgotPasswordSchema = {
  email: { required: true, type: "email" },
};

const resetPasswordSchema = {
  email: { required: true, type: "email" },
  newPassword: { required: true, minLength: 8 },
};

const userSchema = {
  name: { required: true, minLength: 2 },
  email: { required: true, type: "email" },
  phone: { required: true, minLength: 8 },
  password: { required: true, minLength: 8 },
  role: { required: true, enum: USER_ROLES },
};

const productSchema = {
  name: { required: true, minLength: 2 },
  sku: { required: true, minLength: 2 },
  price: { required: true, type: "number", min: 0 },
  brand: {},
  features: {},
};

const warehouseSchema = {
  name: { required: true, minLength: 2 },
  code: { required: true, minLength: 2 },
  location: { required: true, minLength: 2 },
};

const storeSchema = {
  name: { required: true, minLength: 2 },
  code: { required: true, minLength: 2 },
  location: { required: true, minLength: 2 },
};

const orderSchema = {
  items: { required: true },
};

const stockTransferSchema = {
  productId: { required: true, minLength: 10 },
  sourceWarehouseId: { required: true, minLength: 10 },
  quantity: { required: true, type: "number", min: 1 },
};

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  userSchema,
  productSchema,
  warehouseSchema,
  storeSchema,
  orderSchema,
  stockTransferSchema,
};
