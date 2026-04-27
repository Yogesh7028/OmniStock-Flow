const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  getStockOverview,
  getWarehouseStock,
  upsertWarehouseStock,
  getLowStockAlerts,
} = require("../controllers/stockController");

const router = express.Router();

router.get("/", protect, authorize("ADMIN", "WAREHOUSE_MANAGER"), getStockOverview);
router.get("/low-stock", protect, authorize("ADMIN", "WAREHOUSE_MANAGER"), getLowStockAlerts);
router
  .route("/warehouses/:warehouseId")
  .get(protect, authorize("ADMIN", "WAREHOUSE_MANAGER"), getWarehouseStock)
  .put(protect, authorize("ADMIN", "WAREHOUSE_MANAGER"), upsertWarehouseStock);

module.exports = router;
