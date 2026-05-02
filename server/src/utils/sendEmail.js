const transporter = require("../config/mailer");

const withTimeout = (promise) => {
  const timeoutMs = Number(process.env.SMTP_TIMEOUT_MS || 8000);
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      const error = new Error(`SMTP email timed out after ${timeoutMs}ms`);
      error.code = "SMTP_TIMEOUT";
      setTimeout(() => reject(error), timeoutMs);
    }),
  ]);
};

const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    const error = new Error("SMTP email is not configured");
    error.code = "SMTP_NOT_CONFIGURED";
    throw error;
  }

  return withTimeout(transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  }));
};

module.exports = sendEmail;
