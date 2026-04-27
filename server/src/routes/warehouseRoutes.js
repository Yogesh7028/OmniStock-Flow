const express = require("express");
const {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  assignStoreToWarehouse,
} = require("../controllers/warehouseController");
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { warehouseSchema } = require("../utils/validationSchemas");

const router = express.Router();

router
  .route("/")
  .get(protect, getWarehouses)
  .post(protect, authorize("ADMIN", "WAREHOUSE_MANAGER"), validate(warehouseSchema), createWarehouse);
router
  .route("/:id")
  .put(protect, authorize("ADMIN", "WAREHOUSE_MANAGER"), updateWarehouse)
  .delete(protect, authorize("ADMIN", "WAREHOUSE_MANAGER"), deleteWarehouse);
router.put(
  "/:id/stores/:storeId",
  protect,
  authorize("ADMIN", "WAREHOUSE_MANAGER"),
  assignStoreToWarehouse
);

module.exports = router;
