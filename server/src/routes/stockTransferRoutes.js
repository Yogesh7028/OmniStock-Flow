const express = require("express");
const {
  transferWarehouseToStore,
  transferWarehouseToWarehouse,
  getTransferHistory,
} = require("../controllers/stockTransferController");
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { stockTransferSchema } = require("../utils/validationSchemas");

const router = express.Router();

router.post("/warehouse-to-store", protect, authorize("WAREHOUSE_MANAGER", "ADMIN"), validate({ ...stockTransferSchema, destinationStoreId: { required: true, minLength: 10 } }), transferWarehouseToStore);
router.post(
  "/warehouse-to-warehouse",
  protect,
  authorize("WAREHOUSE_MANAGER", "ADMIN"),
  validate({ ...stockTransferSchema, destinationWarehouseId: { required: true, minLength: 10 } }),
  transferWarehouseToWarehouse
);
router.get("/history", protect, authorize("WAREHOUSE_MANAGER", "ADMIN"), getTransferHistory);

module.exports = router;
