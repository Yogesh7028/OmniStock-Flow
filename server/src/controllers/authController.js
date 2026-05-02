const crypto = require("crypto");
const { User, USER_ROLES } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");
const sendEmail = require("../utils/sendEmail");
const { generateToken } = require("../utils/generateToken");
const sanitizeUser = require("../utils/sanitizeUser");

const OTP_TTL_MINUTES = 10;

const roleAliases = {
  ADMIN: "ADMIN",
  Admin: "ADMIN",
  STORE_MANAGER: "STORE_MANAGER",
  CUSTOMER: "STORE_MANAGER",
  Customer: "STORE_MANAGER",
  customer: "STORE_MANAGER",
  STORE_OWNER: "STORE_MANAGER",
  StoreOwner: "STORE_MANAGER",
  storeowner: "STORE_MANAGER",
  WAREHOUSE_MANAGER: "WAREHOUSE_MANAGER",
  WarehouseManager: "WAREHOUSE_MANAGER",
  warehousemanager: "WAREHOUSE_MANAGER",
  SUPPLIER: "SUPPLIER",
  Supplier: "SUPPLIER",
  supplier: "SUPPLIER",
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const normalizeRole = (role) => {
  const normalized = roleAliases[role] || roleAliases[String(role || "").replace(/\s+/g, "")];
  return normalized || "STORE_MANAGER";
};

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

const hashOtp = (otp) => crypto.createHash("sha256").update(String(otp)).digest("hex");

const buildOtpExpiry = () => new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

const buildOtpEmailHtml = ({ name, otp, title }) => `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
    <h2 style="margin-bottom:8px">${title}</h2>
    <p>Hello ${name || "there"},</p>
    <p>Your OmniStock Flow verification code is:</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:6px;margin:24px 0">${otp}</p>
    <p>This code expires in ${OTP_TTL_MINUTES} minutes.</p>
    <p>If you did not request this, you can safely ignore this email.</p>
  </div>
`;

const sendOtpEmail = async ({ user, otp, purpose }) => {
  const title =
    purpose === "RESET_PASSWORD"
      ? "Reset your OmniStock Flow password"
      : "Verify your OmniStock Flow account";

  try {
    await sendEmail({
      to: user.email,
      subject: title,
      text: `Your OmniStock Flow OTP is ${otp}. It expires in ${OTP_TTL_MINUTES} minutes.`,
      html: buildOtpEmailHtml({ name: user.name, otp, title }),
    });
    return {};
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
    return { devOtp: otp, emailWarning: error.message };
  }
};

const createPublicUser = (user) => sanitizeUser(user);

const ensureValidRole = (role) => {
  if (!USER_ROLES.includes(role)) {
    const error = new Error("Invalid user role");
    error.statusCode = 400;
    throw error;
  }
};

const register = asyncHandler(async (req, res) => {
  const { name, password, phone, storeName } = req.body;
  const email = normalizeEmail(req.body.email);
  const role = normalizeRole(req.body.role);
  ensureValidRole(role);

  const existingUser = await User.findOne({ email }).select("+otp +otpExpiresAt");
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const otp = generateOtp();
  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    storeName: storeName || "",
    isVerified: false,
    otp: hashOtp(otp),
    otpExpiresAt: buildOtpExpiry(),
  });

  const delivery = await sendOtpEmail({ user, otp, purpose: "REGISTER" });

  successResponse(
    res,
    "Registration successful. Please verify the OTP sent to your email.",
    {
      user: createPublicUser(user),
      email: user.email,
      ...delivery,
    },
    201
  );
});

const verifyOtp = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || "").trim();

  const user = await User.findOne({ email }).select("+otp +otpExpiresAt");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    successResponse(res, "Account is already verified", { user: createPublicUser(user) });
    return;
  }

  if (!user.otp || user.otp !== hashOtp(otp) || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  successResponse(res, "Email verified successfully", { user: createPublicUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error("Please verify your email before logging in");
  }

  const token = generateToken(user);

  successResponse(res, "Login successful", {
    token,
    accessToken: token,
    user: createPublicUser(user),
  });
});

const resendOtp = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const user = await User.findOne({ email }).select("+otp +otpExpiresAt");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("Account is already verified");
  }

  const otp = generateOtp();
  user.otp = hashOtp(otp);
  user.otpExpiresAt = buildOtpExpiry();
  await user.save();

  const delivery = await sendOtpEmail({ user, otp, purpose: "REGISTER" });
  successResponse(res, "OTP resent to email", { email: user.email, ...delivery });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const user = await User.findOne({ email }).select("+resetPasswordOtp +resetPasswordOtpExpiresAt");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const otp = generateOtp();
  user.resetPasswordOtp = hashOtp(otp);
  user.resetPasswordOtpExpiresAt = buildOtpExpiry();
  await user.save();

  const delivery = await sendOtpEmail({ user, otp, purpose: "RESET_PASSWORD" });
  successResponse(res, "Password reset OTP sent to email", { email: user.email, ...delivery });
});

const resetPassword = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || "").trim();
  const password = req.body.password || req.body.newPassword;

  const user = await User.findOne({ email }).select(
    "+password +resetPasswordOtp +resetPasswordOtpExpiresAt"
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (
    !user.resetPasswordOtp ||
    user.resetPasswordOtp !== hashOtp(otp) ||
    !user.resetPasswordOtpExpiresAt ||
    user.resetPasswordOtpExpiresAt < new Date()
  ) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  user.password = password;
  user.resetPasswordOtp = null;
  user.resetPasswordOtpExpiresAt = null;
  await user.save();

  successResponse(res, "Password reset successful");
});

const me = asyncHandler(async (req, res) => {
  successResponse(res, "Authenticated user fetched", { user: createPublicUser(req.user) });
});

module.exports = {
  register,
  verifyOtp,
  login,
  resendOtp,
  forgotPassword,
  resetPassword,
  me,
};
