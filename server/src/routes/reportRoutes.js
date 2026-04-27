const express = require("express");
const { getDashboardReport } = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/dashboard", protect, authorize("ADMIN", "WAREHOUSE_MANAGER", "STORE_MANAGER", "SUPPLIER"), getDashboardReport);

module.exports = router;
