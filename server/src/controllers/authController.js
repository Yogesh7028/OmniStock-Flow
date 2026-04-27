const { User } = require("../models/User");
const Store = require("../models/Store");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");
const sanitizeUser = require("../utils/sanitizeUser");
const cloudinary = require("../config/cloudinary");
const OTP = require("../models/OTP");
const fs = require("fs");
const path = require("path");
const {
  issueUserTokens,
  clearUserSession,
  validateRefreshSession,
  createOtpRecord,
  dispatchOtp,
} = require("../services/authService");

const hasCloudinaryConfig = () =>
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

const uploadStoreLogo = async (file, req) => {
  if (!file) return "";

  if (hasCloudinaryConfig()) {
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "omnistock-flow/stores",
      resource_type: "image",
    });
    return result.secure_url;
  }

  const uploadsDir = path.join(__dirname, "..", "..", "uploads", "stores");
  await fs.promises.mkdir(uploadsDir, { recursive: true });
  const extension = path.extname(file.originalname) || ".jpg";
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
  await fs.promises.writeFile(path.join(uploadsDir, fileName), file.buffer);
  return `${req.protocol}://${req.get("host")}/uploads/stores/${fileName}`;
};

const buildStoreCode = (storeName) =>
  `${String(storeName || "STORE")
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 6)
    .toUpperCase()}-${Date.now().toString().slice(-6)}`;

const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    role,
    storeName,
    storeType,
    storeAddress,
    city,
    gstNumber,
    storeContactNumber,
  } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("User already exists");
  }

  if ((role || "STORE_MANAGER") === "STORE_MANAGER") {
    if (!storeName || !storeType || !storeAddress || !city || !storeContactNumber) {
      res.status(400);
      throw new Error("Store details are required for Customer / Store Owner signup");
    }
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: role || "STORE_MANAGER",
    isVerified: false,
  });

  let store = null;
  if ((role || "STORE_MANAGER") === "STORE_MANAGER") {
    const logoUrl = await uploadStoreLogo(req.file, req);
    store = await Store.create({
      name: storeName,
      code: buildStoreCode(storeName),
      location: `${storeAddress}, ${city}`,
      type: storeType,
      address: storeAddress,
      city,
      gstNumber: gstNumber || "",
      contactNumber: storeContactNumber,
      logoUrl,
      manager: user._id,
    });
  }

  const otpCode = await createOtpRecord({
    email: user.email,
    phone: user.phone,
    purpose: "REGISTER",
  });
  const otpDelivery = await tryDispatchOtp({
    email: user.email,
    phone: user.phone,
    purpose: "REGISTER",
    code: otpCode,
  });

  successResponse(
    res,
    "Registration successful. Verify OTP before signing in.",
    {
      userId: user._id,
      email: user.email,
      phone: user.phone,
      storeId: store?._id,
      ...otpDelivery,
    },
    201
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error("Please verify your account first");
  }

  const authData = await issueUserTokens(user, res);

  successResponse(res, "Login successful", authData);
});

const logout = asyncHandler(async (req, res) => {
  await clearUserSession({ req, res });
  successResponse(res, "Logout successful");
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const otpCode = await createOtpRecord({
    email: user.email,
    phone: user.phone,
    purpose: "RESET_PASSWORD",
  });
  const otpDelivery = await tryDispatchOtp({
    email: user.email,
    phone: user.phone,
    purpose: "RESET_PASSWORD",
    code: otpCode,
  });

  successResponse(res, "Password reset OTP sent.", { email: user.email, ...otpDelivery });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (otp) {
    await verifyOtpOrThrow({ email, code: otp, purpose: "RESET_PASSWORD" });
  }

  user.password = newPassword;
  await user.save();
  successResponse(res, "Password reset successful");
});

const verifyRegistrationOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  await verifyOtpOrThrow({ email, code: otp, purpose: "REGISTER" });

  const user = await User.findOneAndUpdate(
    { email },
    { isVerified: true },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  successResponse(res, "Registration verified", sanitizeUser(user));
});

const verifyResetPasswordOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  await verifyOtpOrThrow({ email, code: otp, purpose: "RESET_PASSWORD", consume: false });
  successResponse(res, "Reset password OTP verified", { email });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const providedRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!providedRefreshToken) {
    res.status(401);
    throw new Error("Refresh token is required");
  }

  let user;
  try {
    user = await validateRefreshSession(providedRefreshToken);
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }

  const authData = await issueUserTokens(user, res);
  successResponse(res, "Token refreshed", authData);
});

const me = asyncHandler(async (req, res) => {
  successResponse(res, "Profile fetched", sanitizeUser(req.user));
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, phone, currentPassword, newPassword } = req.body;
  if (name) user.name = name;
  if (phone) user.phone = phone;

  if (newPassword) {
    if (!currentPassword || !(await user.comparePassword(currentPassword))) {
      res.status(400);
      throw new Error("Current password is required to change password");
    }
    user.password = newPassword;
  }

  await user.save();
  successResponse(res, "Profile updated", sanitizeUser(user));
});

const verifyOtpOrThrow = async ({ email, code, purpose, consume = true }) => {
  const otpRecord = await OTP.findOne({ email, code, purpose }).sort({ createdAt: -1 });
  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    throw new Error("Invalid or expired OTP");
  }
  if (consume) await OTP.deleteOne({ _id: otpRecord._id });
  return otpRecord;
};

const tryDispatchOtp = async ({ email, phone, purpose, code }) => {
  try {
    await dispatchOtp({ email, phone, purpose, code });
    return {};
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
    return { devOtp: code, otpDeliveryWarning: error.message };
  }
};

module.exports = {
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
};
