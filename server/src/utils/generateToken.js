const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET or JWT_ACCESS_SECRET must be configured");
  }
  return secret;
};

const buildAuthPayload = (user) => ({
  id: user._id.toString(),
  role: user.role,
  email: user.email,
});

const generateToken = (user) =>
  jwt.sign(buildAuthPayload(user), getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_ACCESS_EXPIRES_IN || "7d",
  });

const generateAccessToken = (payload) =>
  jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || process.env.JWT_EXPIRES_IN || "7d",
  });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET || getJwtSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

module.exports = {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  buildAuthPayload,
};
