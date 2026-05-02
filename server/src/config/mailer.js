const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  connectionTimeout: Number(process.env.SMTP_TIMEOUT_MS || 8000),
  greetingTimeout: Number(process.env.SMTP_TIMEOUT_MS || 8000),
  socketTimeout: Number(process.env.SMTP_TIMEOUT_MS || 8000),
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

module.exports = transporter;
