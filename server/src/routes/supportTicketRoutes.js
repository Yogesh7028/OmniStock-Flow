const express = require("express");
const {
  getTickets,
  createTicket,
  updateTicket,
} = require("../controllers/supportTicketController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/").get(getTickets).post(createTicket);
router.route("/:id").put(updateTicket);

module.exports = router;
