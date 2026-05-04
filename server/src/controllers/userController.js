const { User, USER_ROLES } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");
const sanitizeUser = require("../utils/sanitizeUser");

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const normalizeRole = (role) => {
  const normalizedRole = String(role || "")
    .trim()
    .toUpperCase();
  return USER_ROLES.includes(normalizedRole) ? normalizedRole : null;
};

const buildUserPayload = (body) => {
  const role = normalizeRole(body.role);
  if (!role) {
    const error = new Error(`Role must be one of: ${USER_ROLES.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }

  return {
    name: String(body.name || "").trim(),
    email: normalizeEmail(body.email),
    phone: String(body.phone || "").trim(),
    password: body.password,
    role,
    isVerified: body.isVerified ?? true,
  };
};

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });
  successResponse(res, "Users fetched", users);
});

const createUser = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({ email: normalizeEmail(req.body.email) });
  if (existingUser) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  const user = await User.create(buildUserPayload(req.body));
  successResponse(res, "User created", sanitizeUser(user), 201);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  Object.assign(user, req.body);
  await user.save();

  successResponse(res, "User updated", sanitizeUser(user));
});

const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  successResponse(res, "User deleted");
});

module.exports = { getUsers, createUser, updateUser, deleteUser };
