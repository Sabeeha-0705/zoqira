const nodemailer = require("nodemailer");

const getTransporter = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    console.log(
      "SMTP config incomplete. Email sending will be logged to console in development."
    );
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: parseInt(smtpPort) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });
};

const sendEmail = async (to, subject, text, html = null) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[EMAIL STUB] To: ${to}\nSubject: ${subject}\nText: ${text}`);
    return { success: true, stub: true };
  }

  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@zoqira.com",
      to,
      subject,
      text,
      html,
    });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail, getTransporter };
