const express = require("express");
const { getStores, createStore, updateStore, deleteStore } = require("../controllers/storeController");
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { storeSchema } = require("../utils/validationSchemas");

const router = express.Router();

router.route("/").get(protect, getStores).post(protect, authorize("ADMIN"), validate(storeSchema), createStore);
router.route("/:id").put(protect, authorize("ADMIN"), updateStore).delete(protect, authorize("ADMIN"), deleteStore);

module.exports = router;
