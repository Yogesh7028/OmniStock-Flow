const { User } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");
const sanitizeUser = require("../utils/sanitizeUser");

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });
  successResponse(res, "Users fetched", users);
});

const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
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
