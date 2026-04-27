const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Warehouse = require("../models/Warehouse");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const populateCart = (query) =>
  query.populate("items.product", "name sku category brand price imageUrl storeStock warehouseStock").populate("items.warehouse", "name code location");

const getCart = asyncHandler(async (req, res) => {
  let cart = await populateCart(Cart.findOne({ user: req.user._id }));
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  successResponse(res, "Cart fetched", cart);
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, warehouseId } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (warehouseId) {
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      res.status(404);
      throw new Error("Warehouse not found");
    }
  }

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: { user: req.user._id } },
    { new: true, upsert: true }
  );

  const existing = cart.items.find(
    (item) =>
      String(item.product) === String(productId) &&
      String(item.warehouse || "") === String(warehouseId || "")
  );

  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, warehouse: warehouseId || null, quantity: Number(quantity) });
  }

  await cart.save();
  const populated = await populateCart(Cart.findById(cart._id));
  successResponse(res, "Product added to cart", populated, 201);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  item.quantity = Number(req.body.quantity);
  await cart.save();
  const populated = await populateCart(Cart.findById(cart._id));
  successResponse(res, "Cart item updated", populated);
});

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter((item) => String(item._id) !== String(req.params.itemId));
  await cart.save();
  const populated = await populateCart(Cart.findById(cart._id));
  successResponse(res, "Cart item removed", populated);
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [] },
    { new: true, upsert: true }
  );
  successResponse(res, "Cart cleared", cart);
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
