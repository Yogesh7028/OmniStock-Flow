const express = require("express");
const { getUsers, createUser, updateUser, deleteUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { userSchema } = require("../utils/validationSchemas");

const router = express.Router();

router.use(protect, authorize("ADMIN"));
router.route("/").get(getUsers).post(validate(userSchema), createUser);
router.route("/:id").put(updateUser).delete(deleteUser);

module.exports = router;
