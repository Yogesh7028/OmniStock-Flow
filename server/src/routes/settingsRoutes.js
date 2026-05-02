const express = require("express");
const { getSettings, updateAccountSettings, updateSettingsSection } = require("../controllers/settingsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getSettings);
router.put("/account", protect, updateAccountSettings);
router.put("/:section", protect, updateSettingsSection);

module.exports = router;
