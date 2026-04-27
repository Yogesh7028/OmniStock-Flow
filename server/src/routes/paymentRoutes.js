const express = require("express");
const { createRazorpayOrder, verifyPayment, getPayments } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/create-order", protect, authorize("STORE_MANAGER", "ADMIN"), createRazorpayOrder);
router.post("/verify-payment", protect, authorize("STORE_MANAGER", "ADMIN"), verifyPayment);
router.get("/", protect, authorize("ADMIN", "STORE_MANAGER", "SUPPLIER"), getPayments);

module.exports = router;
