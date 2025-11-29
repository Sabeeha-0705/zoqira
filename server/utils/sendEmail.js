const nodemailer = require("nodemailer");

// sendEmail utility
// Supports plain SMTP auth or OAuth2 (when SMTP_OAUTH_* env vars are provided).
// Optional env vars:
// - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
// - SMTP_SECURE (true/false) to force secure connection (overrides port heuristic)
// - SMTP_REQUIRE_TLS (true/false)
// - SMTP_OAUTH_CLIENT_ID, SMTP_OAUTH_CLIENT_SECRET, SMTP_OAUTH_REFRESH_TOKEN, SMTP_OAUTH_ACCESS_TOKEN
// - EMAIL_FROM (from address)
module.exports = async function sendEmail({ to, subject, text, html }) {
  try {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.EMAIL_FROM || user;

    const smtpSecureEnv = process.env.SMTP_SECURE;
    const smtpRequireTLS = process.env.SMTP_REQUIRE_TLS === "true";

    const oauthClientId = process.env.SMTP_OAUTH_CLIENT_ID;
    const oauthClientSecret = process.env.SMTP_OAUTH_CLIENT_SECRET;
    const oauthRefreshToken = process.env.SMTP_OAUTH_REFRESH_TOKEN;
    const oauthAccessToken = process.env.SMTP_OAUTH_ACCESS_TOKEN;

    // Decide whether we have sufficient SMTP config to attempt sending
    const canSend =
      host && port && user && (pass || oauthRefreshToken || oauthAccessToken);

    if (canSend) {
      const smtpSecure =
        typeof smtpSecureEnv !== "undefined"
          ? smtpSecureEnv === "true"
          : Number(port) === 465;

      const transportOptions = {
        host,
        port: Number(port),
        secure: smtpSecure,
        requireTLS: smtpRequireTLS,
      };

      // Prefer OAuth2 if OAuth refresh token + client credentials are provided
      if (oauthClientId && oauthClientSecret && oauthRefreshToken) {
        transportOptions.auth = {
          type: "OAuth2",
          user,
          clientId: oauthClientId,
          clientSecret: oauthClientSecret,
          refreshToken: oauthRefreshToken,
          accessToken: oauthAccessToken,
        };
      } else {
        transportOptions.auth = { user, pass };
      }

      const transporter = nodemailer.createTransport(transportOptions);

      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      console.log(
        "sendEmail: sent email to",
        to,
        "messageId=",
        info && info.messageId
      );
      return info;
    }

    // Fallback: log the message for development
    console.log("sendEmail (stub):", { from, to, subject, text, html });
    return { stub: true, from, to, subject };
  } catch (err) {
    console.error("sendEmail error:", err);
    throw err;
  }
};
