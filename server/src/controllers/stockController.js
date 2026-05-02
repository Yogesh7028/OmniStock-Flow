const Product = require("../models/Product");
const Warehouse = require("../models/Warehouse");
const Stock = require("../models/Stock");
const { User } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");
const { createNotification } = require("../services/notificationService");

const getStockOverview = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  const stock = products.map((product) => ({
    productId: product._id,
    productName: product.name,
    sku: product.sku,
    generalStock: product.generalStock,
    warehouseStock: product.warehouseStock,
    storeStock: product.storeStock,
    lowStockThreshold: product.lowStockThreshold,
  }));

  successResponse(res, "Stock overview fetched", stock);
});

const getWarehouseStock = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.findById(req.params.warehouseId).populate(
    "stock.product",
    "name sku category brand price imageUrl lowStockThreshold"
  );
  if (!warehouse) {
    res.status(404);
    throw new Error("Warehouse not found");
  }
  successResponse(res, "Warehouse stock fetched", warehouse.stock);
});

const upsertWarehouseStock = asyncHandler(async (req, res) => {
  const { warehouseId } = req.params;
  const { productId, quantity, minimumStock } = req.body;
  const [warehouse, product] = await Promise.all([
    Warehouse.findById(warehouseId),
    Product.findById(productId),
  ]);

  if (!warehouse || !product) {
    res.status(404);
    throw new Error("Warehouse or product not found");
  }

  const nextQuantity = Number(quantity);
  const stockItem = warehouse.stock.find((item) => String(item.product) === String(productId));
  if (stockItem) {
    stockItem.quantity = nextQuantity;
  } else {
    warehouse.stock.push({ product: productId, quantity: nextQuantity });
  }

  if (minimumStock !== undefined) {
    product.lowStockThreshold = Number(minimumStock);
  }

  await Stock.findOneAndUpdate(
    { warehouse: warehouseId, product: productId },
    { quantity: nextQuantity, warehouse: warehouseId, product: productId },
    { upsert: true, new: true }
  );

  product.warehouseStock = await sumProductWarehouseStock(productId, warehouse);
  await Promise.all([warehouse.save(), product.save()]);

  await notifyLowStockIfNeeded({ product, warehouse, quantity: nextQuantity });

  successResponse(res, "Warehouse stock updated", { warehouseId, product, quantity: nextQuantity });
});

const getLowStockAlerts = asyncHandler(async (req, res) => {
  const warehouses = await Warehouse.find().populate(
    "stock.product",
    "name sku category brand lowStockThreshold"
  );
  const alerts = [];

  warehouses.forEach((warehouse) => {
    warehouse.stock.forEach((item) => {
      if (item.product && item.quantity <= item.product.lowStockThreshold) {
        alerts.push({
          warehouse: { _id: warehouse._id, name: warehouse.name, code: warehouse.code },
          product: item.product,
          quantity: item.quantity,
          minimumStock: item.product.lowStockThreshold,
        });
      }
    });
  });

  successResponse(res, "Low stock alerts fetched", alerts);
});

const sumProductWarehouseStock = async (productId, changedWarehouse) => {
  const warehouses = await Warehouse.find({ "stock.product": productId });
  const includesChangedWarehouse = warehouses.some(
    (warehouse) => String(warehouse._id) === String(changedWarehouse._id)
  );
  const allWarehouses = warehouses.map((warehouse) =>
    String(warehouse._id) === String(changedWarehouse._id) ? changedWarehouse : warehouse
  );
  if (!includesChangedWarehouse) allWarehouses.push(changedWarehouse);

  return allWarehouses.reduce((sum, warehouse) => {
    const item = warehouse.stock.find((entry) => String(entry.product) === String(productId));
    return sum + Number(item?.quantity || 0);
  }, 0);
};

const notifyLowStockIfNeeded = async ({ product, warehouse, quantity }) => {
  if (quantity > product.lowStockThreshold) return;

  const recipients = await User.find({ role: { $in: ["ADMIN", "WAREHOUSE_MANAGER"] } });
  await Promise.all(
    recipients.map((user) =>
      createNotification({
        recipient: user._id,
        title: "Low stock alert",
        message: `${product.name} is below minimum stock in ${warehouse.name}.`,
        type: "LOW_STOCK",
        metadata: { productId: product._id, warehouseId: warehouse._id },
      })
    )
  );
};

module.exports = {
  getStockOverview,
  getWarehouseStock,
  upsertWarehouseStock,
  getLowStockAlerts,
  notifyLowStockIfNeeded,
};
