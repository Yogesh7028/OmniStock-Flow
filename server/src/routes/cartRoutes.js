const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, authorize("STORE_MANAGER", "ADMIN"));
router.route("/").get(getCart).post(addToCart).delete(clearCart);
router.route("/:itemId").put(updateCartItem).delete(removeCartItem);

module.exports = router;
