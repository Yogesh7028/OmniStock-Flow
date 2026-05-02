const sanitizeUser = (user) => {
  if (!user) return null;
  const source = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete source.password;
  delete source.refreshToken;
  delete source.otp;
  delete source.otpExpiresAt;
  delete source.resetPasswordOtp;
  delete source.resetPasswordOtpExpiresAt;
  return source;
};

module.exports = sanitizeUser;
