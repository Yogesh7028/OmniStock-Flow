const Store = require("../models/Store");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const getStores = asyncHandler(async (req, res) => {
  const stores = await Store.find()
    .populate("manager", "name email")
    .populate("warehouse", "name code location");
  successResponse(res, "Stores fetched", stores);
});

const createStore = asyncHandler(async (req, res) => {
  const store = await Store.create(req.body);
  successResponse(res, "Store created", store, 201);
});

const updateStore = asyncHandler(async (req, res) => {
  const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  successResponse(res, "Store updated", store);
});

const deleteStore = asyncHandler(async (req, res) => {
  await Store.findByIdAndDelete(req.params.id);
  successResponse(res, "Store deleted");
});

module.exports = { getStores, createStore, updateStore, deleteStore };
