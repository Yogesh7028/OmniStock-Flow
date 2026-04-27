const Product = require("../models/Product");
const Warehouse = require("../models/Warehouse");
const Store = require("../models/Store");
const StockTransfer = require("../models/StockTransfer");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const updateWarehouseStockBucket = (warehouse, productId, quantityDiff) => {
  const stockItem = warehouse.stock.find((item) => String(item.product) === String(productId));
  if (stockItem) {
    stockItem.quantity += quantityDiff;
  } else {
    warehouse.stock.push({ product: productId, quantity: quantityDiff });
  }
};

const getSourceWarehouseStock = (warehouse, productId, fallbackQuantity = 0) => {
  let stockItem = warehouse.stock.find((item) => String(item.product) === String(productId));
  if (!stockItem && Number(fallbackQuantity) > 0) {
    warehouse.stock.push({ product: productId, quantity: Number(fallbackQuantity) });
    stockItem = warehouse.stock[warehouse.stock.length - 1];
  }
  return stockItem;
};

const transferWarehouseToStore = asyncHandler(async (req, res) => {
  const { productId, sourceWarehouseId, destinationStoreId, quantity } = req.body;
  const [product, warehouse, store] = await Promise.all([
    Product.findById(productId),
    Warehouse.findById(sourceWarehouseId),
    Store.findById(destinationStoreId),
  ]);

  if (!product || !warehouse || !store) {
    res.status(404);
    throw new Error("Product, warehouse, or store not found");
  }

  const transferQuantity = Number(quantity);
  const sourceItem = getSourceWarehouseStock(warehouse, productId, product.warehouseStock);
  if (!sourceItem || sourceItem.quantity < transferQuantity || product.warehouseStock < transferQuantity) {
    res.status(400);
    throw new Error("Insufficient warehouse stock");
  }

  product.warehouseStock -= transferQuantity;
  product.storeStock += transferQuantity;
  updateWarehouseStockBucket(warehouse, productId, -transferQuantity);

  await Promise.all([product.save(), warehouse.save()]);

  const transfer = await StockTransfer.create({
    type: "WAREHOUSE_TO_STORE",
    product: productId,
    sourceWarehouse: sourceWarehouseId,
    destinationStore: destinationStoreId,
    quantity: transferQuantity,
    transferredBy: req.user._id,
  });

  successResponse(res, "Stock transferred to store", transfer, 201);
});

const transferWarehouseToWarehouse = asyncHandler(async (req, res) => {
  const { productId, sourceWarehouseId, destinationWarehouseId, quantity } = req.body;
  const [product, source, destination] = await Promise.all([
    Product.findById(productId),
    Warehouse.findById(sourceWarehouseId),
    Warehouse.findById(destinationWarehouseId),
  ]);

  if (!product || !source || !destination) {
    res.status(404);
    throw new Error("Product or warehouse not found");
  }

  const transferQuantity = Number(quantity);
  const sourceItem = getSourceWarehouseStock(source, productId, product.warehouseStock);
  if (!sourceItem || sourceItem.quantity < transferQuantity) {
    res.status(400);
    throw new Error("Insufficient source warehouse stock");
  }

  updateWarehouseStockBucket(source, productId, -transferQuantity);
  updateWarehouseStockBucket(destination, productId, transferQuantity);

  await Promise.all([source.save(), destination.save()]);

  const transfer = await StockTransfer.create({
    type: "WAREHOUSE_TO_WAREHOUSE",
    product: productId,
    sourceWarehouse: sourceWarehouseId,
    destinationWarehouse: destinationWarehouseId,
    quantity: transferQuantity,
    transferredBy: req.user._id,
  });

  successResponse(res, "Stock transferred to warehouse", transfer, 201);
});

const getTransferHistory = asyncHandler(async (req, res) => {
  const transfers = await StockTransfer.find()
    .populate("product", "name sku")
    .populate("sourceWarehouse", "name code")
    .populate("destinationWarehouse", "name code")
    .populate("destinationStore", "name code")
    .sort({ createdAt: -1 });
  successResponse(res, "Transfer history fetched", transfers);
});

module.exports = {
  transferWarehouseToStore,
  transferWarehouseToWarehouse,
  getTransferHistory,
};
