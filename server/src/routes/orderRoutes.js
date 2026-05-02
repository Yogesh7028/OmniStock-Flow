const express = require("express");
const { getOrders, createOrder, updateOrderStatus, receiveSupplierDelivery } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { orderSchema } = require("../utils/validationSchemas");

const router = express.Router();

router.route("/").get(protect, getOrders).post(protect, authorize("STORE_MANAGER", "ADMIN"), validate(orderSchema), createOrder);
router.route("/:id/status").put(protect, authorize("SUPPLIER", "ADMIN", "WAREHOUSE_MANAGER"), updateOrderStatus);
router.route("/:id/receive").put(protect, authorize("WAREHOUSE_MANAGER", "ADMIN"), receiveSupplierDelivery);

module.exports = router;
