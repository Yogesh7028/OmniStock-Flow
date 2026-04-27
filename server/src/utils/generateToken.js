const jwt = require("jsonwebtoken");

const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

const buildAuthPayload = (user) => ({
  id: user._id,
  role: user.role,
  email: user.email,
});

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  buildAuthPayload,
};
