const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    return res.status(401).json({ success: false, message: "User not found" });
  }

  req.user = user;
  next();
});

module.exports = { protect };
