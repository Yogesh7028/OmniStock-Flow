const Order = require("../models/Order");
const { User } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const getSupplierOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ supplier: req.user._id }).sort({ createdAt: -1 });
  successResponse(res, "Supplier orders fetched", orders);
});

const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await User.find({ role: "SUPPLIER" })
    .select("name email phone")
    .sort({ name: 1 });
  successResponse(res, "Suppliers fetched", suppliers);
});

module.exports = { getSupplierOrders, getSuppliers };
