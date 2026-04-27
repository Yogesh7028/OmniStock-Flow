const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const { User } = require("../models/User");
const { generateOTP } = require("./otpService");
const sendEmail = require("./emailService");
const sendSMS = require("./smsService");
const {
  generateAccessToken,
  generateRefreshToken,
  buildAuthPayload,
} = require("../utils/generateToken");

const otpExpiry = () =>
  new Date(Date.now() + Number(process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);

const setAuthCookies = (res, accessToken, refreshToken) => {
  const secure = process.env.COOKIE_SECURE === "true";
  const baseOptions = {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
  };

  res.cookie("accessToken", accessToken, {
    ...baseOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    ...baseOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const createOtpRecord = async ({ email, phone, purpose }) => {
  const code = generateOTP();
  await OTP.findOneAndDelete({ email, purpose });
  await OTP.create({ email, phone, code, purpose, expiresAt: otpExpiry() });
  return code;
};

const dispatchOtp = async ({ email, phone, purpose, code }) => {
  const otpMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 10);
  const messageByPurpose = {
    REGISTER: {
      subject: "Verify your OmniStock Flow account",
      html: `<p>Your account verification OTP is <strong>${code}</strong>. It expires in ${otpMinutes} minutes.</p>`,
      sms: `Your OmniStock Flow account OTP is ${code}`,
    },
    RESET_PASSWORD: {
      subject: "Reset your OmniStock Flow password",
      html: `<p>Your password reset OTP is <strong>${code}</strong>. It expires in ${otpMinutes} minutes.</p>`,
      sms: `Reset OTP: ${code}`,
    },
  };

  const { subject, html, sms } = messageByPurpose[purpose];

  const results = await Promise.allSettled([
    sendEmail({ to: email, subject, html }),
    sendSMS({ phone, message: sms }),
  ]);

  const delivered = results.some(
    (result) => result.status === "fulfilled" && !result.value?.skipped
  );

  if (!delivered) {
    const errors = results
      .map((result) =>
        result.status === "rejected" ? result.reason.message : result.value?.reason
      )
      .filter(Boolean)
      .join("; ");
    throw new Error(`OTP delivery failed. Configure SMTP or Twilio. ${errors}`);
  }
};

const issueUserTokens = async (user, res) => {
  const payload = buildAuthPayload(user);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);

  return { user: payload, accessToken, refreshToken };
};

const clearUserSession = async ({ req, res }) => {
  const providedRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  } else if (providedRefreshToken) {
    try {
      const decoded = jwt.verify(providedRefreshToken, process.env.JWT_REFRESH_SECRET);
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    } catch (error) {
      // Ignore invalid refresh token during logout.
    }
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};

const validateRefreshSession = async (providedRefreshToken) => {
  const decoded = jwt.verify(providedRefreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);

  if (!user || !user.refreshToken || !user.isVerified) {
    throw new Error("Invalid refresh session");
  }

  const incomingHash = crypto.createHash("sha256").update(providedRefreshToken).digest("hex");
  if (user.refreshToken !== incomingHash) {
    throw new Error("Refresh token mismatch");
  }

  return user;
};

module.exports = {
  createOtpRecord,
  dispatchOtp,
  issueUserTokens,
  clearUserSession,
  validateRefreshSession,
};
