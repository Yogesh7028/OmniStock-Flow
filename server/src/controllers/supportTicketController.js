const SupportTicket = require("../models/SupportTicket");
const { User } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");
const { createNotification } = require("../services/notificationService");

const getTickets = asyncHandler(async (req, res) => {
  const filter = req.user.role === "ADMIN" ? {} : { createdBy: req.user._id };
  const tickets = await SupportTicket.find(filter)
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role")
    .populate("responses.user", "name email role")
    .sort({ createdAt: -1 });
  successResponse(res, "Support tickets fetched", tickets);
});

const createTicket = asyncHandler(async (req, res) => {
  if (req.user.role === "ADMIN") {
    res.status(403);
    throw new Error("Admins resolve support tickets and cannot create support tickets");
  }

  const ticket = await SupportTicket.create({
    createdBy: req.user._id,
    subject: req.body.subject,
    message: req.body.message,
    priority: req.body.priority || "MEDIUM",
  });

  const admins = await User.find({ role: "ADMIN" });
  await Promise.all(
    admins.map((admin) =>
      createNotification({
        recipient: admin._id,
        title: "New support ticket",
        message: `${req.user.email} raised: ${ticket.subject}`,
        metadata: { ticketId: ticket._id },
      })
    )
  );

  successResponse(res, "Support ticket created", ticket, 201);
});

const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("Support ticket not found");
  }

  const isAdmin = req.user.role === "ADMIN";
  const isOwner = String(ticket.createdBy) === String(req.user._id);

  if (!isAdmin && !isOwner) {
    res.status(403);
    throw new Error("You can only update your own support tickets");
  }

  const allowed = isAdmin ? ["status", "priority", "assignedTo"] : [];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) ticket[field] = req.body[field];
  });

  if (req.body.response) {
    ticket.responses.push({ user: req.user._id, message: req.body.response });
    if (isAdmin && !ticket.assignedTo) ticket.assignedTo = req.user._id;
    if (isAdmin && ticket.status === "OPEN") ticket.status = "IN_PROGRESS";
  }

  await ticket.save();

  const populatedTicket = await SupportTicket.findById(ticket._id)
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role")
    .populate("responses.user", "name email role");

  successResponse(res, "Support ticket updated", populatedTicket);
});

module.exports = { getTickets, createTicket, updateTicket };
