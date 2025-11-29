require("dotenv").config();
const sendEmail = require("../utils/sendEmail");

(async () => {
  try {
    const to =
      process.env.ADMIN_EMAILS || process.env.SMTP_USER || "you@example.com";
    console.log("Attempting to send test email to", to);
    const info = await sendEmail({
      to,
      subject: "ZOQIRA - test email",
      text: "This is a test email from the ZOQIRA sendEmail utility.",
      html: "<p>This is a test email from the <strong>ZOQIRA</strong> sendEmail utility.</p>",
    });

    console.log("sendEmail result:", info);
    process.exit(0);
  } catch (err) {
    console.error("sendEmail test failed:", err);
    process.exit(1);
  }
})();
