const Warehouse = require("../models/Warehouse");
const Store = require("../models/Store");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const getWarehouses = asyncHandler(async (req, res) => {
  const warehouses = await Warehouse.find()
    .populate("manager", "name email")
    .populate("stock.product", "name category brand lowStockThreshold");
  successResponse(res, "Warehouses fetched", warehouses);
});

const createWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.create(req.body);
  successResponse(res, "Warehouse created", warehouse, 201);
});

const updateWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  successResponse(res, "Warehouse updated", warehouse);
});

const deleteWarehouse = asyncHandler(async (req, res) => {
  await Warehouse.findByIdAndDelete(req.params.id);
  successResponse(res, "Warehouse deleted");
});

const assignStoreToWarehouse = asyncHandler(async (req, res) => {
  const [warehouse, store] = await Promise.all([
    Warehouse.findById(req.params.id),
    Store.findById(req.params.storeId),
  ]);

  if (!warehouse || !store) {
    res.status(404);
    throw new Error("Warehouse or store not found");
  }

  store.warehouse = warehouse._id;
  await store.save();

  successResponse(res, "Store assigned to warehouse", store);
});

module.exports = {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  assignStoreToWarehouse,
};
