const express = require("express");
const { getProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validateMiddleware");
const { productSchema } = require("../utils/validationSchemas");

const router = express.Router();

router.route("/").get(protect, getProducts).post(protect, authorize("ADMIN", "WAREHOUSE_MANAGER"), upload.single("image"), validate(productSchema), createProduct);
router
  .route("/:id")
  .put(protect, authorize("ADMIN", "WAREHOUSE_MANAGER"), upload.single("image"), updateProduct)
  .delete(protect, authorize("ADMIN", "WAREHOUSE_MANAGER"), deleteProduct);

module.exports = router;
