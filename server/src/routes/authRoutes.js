const express = require("express");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyRegistrationOtp,
  verifyResetPasswordOtp,
  refreshAccessToken,
  me,
  updateMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../utils/validationSchemas");

const router = express.Router();

router.post("/register", upload.single("storeLogo"), validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-registration-otp", verifyRegistrationOtp);
router.post("/verify-reset-otp", verifyResetPasswordOtp);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", protect, me);
router.put("/me", protect, updateMe);

module.exports = router;
