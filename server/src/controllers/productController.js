const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

const hasCloudinaryConfig = () =>
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

const uploadProductImage = async (file, req) => {
  if (!file) return "";

  if (hasCloudinaryConfig()) {
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "omnistock-flow/products",
      resource_type: "image",
    });
    return result.secure_url;
  }

  const uploadsDir = path.join(__dirname, "..", "..", "uploads", "products");
  await fs.promises.mkdir(uploadsDir, { recursive: true });
  const extension = path.extname(file.originalname) || ".jpg";
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
  await fs.promises.writeFile(path.join(uploadsDir, fileName), file.buffer);
  return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`;
};

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("supplier", "name email").sort({ createdAt: -1 });
  successResponse(res, "Products fetched", products);
});

const createProduct = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    createdBy: req.user._id,
  };
  if (typeof payload.features === "string") {
    payload.features = payload.features
      .split(",")
      .map((feature) => feature.trim())
      .filter(Boolean);
  }
  const imageUrl = await uploadProductImage(req.file, req);
  if (imageUrl) payload.imageUrl = imageUrl;
  const product = await Product.create(payload);
  successResponse(res, "Product created", product, 201);
});

const updateProduct = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (typeof payload.features === "string") {
    payload.features = payload.features
      .split(",")
      .map((feature) => feature.trim())
      .filter(Boolean);
  }
  const imageUrl = await uploadProductImage(req.file, req);
  if (imageUrl) payload.imageUrl = imageUrl;
  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  successResponse(res, "Product updated", product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  successResponse(res, "Product deleted");
});

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
