const multer = require("multer");
// Default to memory storage so local development works without Cloudinary-specific adapters.
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
