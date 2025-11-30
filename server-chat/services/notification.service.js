const { sendEmail } = require("../utils/sendEmail");

// In-app notifications service
class NotificationService {
  static async sendChatRequestNotification(toUserId, fromUser) {
    // TODO: Create Notification model to persist in-app notifications
    // For now, just send email
    const emailResult = await sendEmail(
      toUserId.email,
      "Chat Request from " + fromUser.name,
      `Hi ${toUserId.name}, ${fromUser.name} has sent you a chat request. Open the app to respond!`,
      `<p>Hi ${toUserId.name},</p><p><strong>${fromUser.name}</strong> has sent you a chat request.</p><p>Open the app to accept or decline.</p>`
    );

    return emailResult;
  }

  static async sendChatMessageNotification(toUser, fromUser, messageText) {
    // TODO: Create Notification model
    // Email notification (optional, can be rate-limited)
    const truncatedText =
      messageText.length > 100
        ? messageText.substring(0, 100) + "..."
        : messageText;

    const emailResult = await sendEmail(
      toUser.email,
      "New message from " + fromUser.name,
      `New message from ${fromUser.name}: ${truncatedText}`,
      `<p>New message from <strong>${fromUser.name}</strong>:</p><p>${truncatedText}</p>`
    );

    return emailResult;
  }

  static async sendGroupInviteNotification(toUser, inviter, groupName) {
    // TODO: Create Notification model
    const emailResult = await sendEmail(
      toUser.email,
      `${inviter.name} invited you to ${groupName}`,
      `${inviter.name} has invited you to join the group "${groupName}". Open the app to accept!`,
      `<p>${inviter.name} has invited you to join the group <strong>"${groupName}"</strong>.</p><p>Open the app to view and accept the invitation.</p>`
    );

    return emailResult;
  }
}

module.exports = NotificationService;
