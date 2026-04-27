const express = require("express");
const { getSupplierOrders, getSuppliers } = require("../controllers/supplierController");
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, authorize("STORE_MANAGER", "ADMIN", "WAREHOUSE_MANAGER"), getSuppliers);
router.get("/orders", protect, authorize("SUPPLIER", "ADMIN"), getSupplierOrders);

module.exports = router;
