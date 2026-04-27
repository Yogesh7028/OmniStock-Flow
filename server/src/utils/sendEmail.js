const transporter = require("../config/mailer");

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return { skipped: true, reason: "SMTP email is not configured" };
  }

  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
