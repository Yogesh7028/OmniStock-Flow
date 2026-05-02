const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const getJwtSecret = () => process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  if (!getJwtSecret()) {
    res.status(500);
    throw new Error("JWT secret is not configured");
  }

  const decoded = jwt.verify(token, getJwtSecret());
  const user = await User.findById(decoded.id).select("-password -otp -resetPasswordOtp");

  if (!user) {
    res.status(401);
    throw new Error("Not authorized, user not found");
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error("Please verify your account first");
  }

  req.user = user;
  next();
});

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error("Access denied for this role");
  }

  next();
};

module.exports = { protect, authorizeRoles };
