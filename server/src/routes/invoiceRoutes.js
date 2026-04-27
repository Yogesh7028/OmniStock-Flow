const express = require("express");
const { getInvoices, downloadInvoice } = require("../controllers/invoiceController");
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, authorize("ADMIN", "WAREHOUSE_MANAGER", "STORE_MANAGER"), getInvoices);
router.get("/:id/download", protect, authorize("ADMIN", "WAREHOUSE_MANAGER", "STORE_MANAGER"), downloadInvoice);

module.exports = router;
