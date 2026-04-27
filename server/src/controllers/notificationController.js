const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const createNotification = async ({ recipient, title, message, type = "INFO", metadata = {} }) => {
  return Notification.create({ recipient, title, message, type, metadata });
};

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
  successResponse(res, "Notifications fetched", notifications);
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { read: true },
    { new: true }
  );
  successResponse(res, "Notification marked as read", notification);
});

module.exports = {
  createNotification,
  getNotifications,
  markNotificationRead,
};
