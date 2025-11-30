const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const chatController = require("../controllers/chat.controller");
const uploadMiddleware = require("../middleware/upload.middleware");

// Protected routes - all require authentication

// POST /api/chat/rooms/direct/request - Send initial chat request
router.post(
  "/rooms/direct/request",
  authMiddleware,
  uploadMiddleware.single("file"),
  (req, res, next) => {
    chatController.sendChatRequest(req, res).catch(next);
  }
);

// POST /api/chat/rooms/direct/respond - Accept or reject request
router.post("/rooms/direct/respond", authMiddleware, (req, res, next) => {
  chatController.respondToChatRequest(req, res).catch(next);
});

// POST /api/chat/rooms/direct/message - Send direct message (after request accepted)
router.post(
  "/rooms/direct/message",
  authMiddleware,
  uploadMiddleware.single("file"),
  (req, res, next) => {
    chatController.sendDirectMessage(req, res).catch(next);
  }
);

// POST /api/chat/rooms/group - Create group chat
router.post(
  "/rooms/group",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  (req, res, next) => {
    chatController.createGroupChat(req, res).catch(next);
  }
);

// POST /api/chat/rooms/group/:roomId/invite - Invite members to group
router.post("/rooms/group/:roomId/invite", authMiddleware, (req, res, next) => {
  chatController.inviteToGroup(req, res).catch(next);
});

// POST /api/chat/rooms/group/:roomId/message - Send group message
router.post(
  "/rooms/group/:roomId/message",
  authMiddleware,
  uploadMiddleware.single("file"),
  (req, res, next) => {
    chatController.sendGroupMessage(req, res).catch(next);
  }
);

// GET /api/chat/rooms - List all rooms for current user
router.get("/rooms", authMiddleware, (req, res, next) => {
  chatController.getRooms(req, res).catch(next);
});

// GET /api/chat/rooms/:roomId/messages - Get message history (paginated)
router.get("/rooms/:roomId/messages", authMiddleware, (req, res, next) => {
  chatController.getMessages(req, res).catch(next);
});

// POST /api/chat/rooms/:roomId/mark-read - Mark messages as read
router.post("/rooms/:roomId/mark-read", authMiddleware, (req, res, next) => {
  chatController.markMessagesAsRead(req, res).catch(next);
});

// POST /api/chat/rooms/:roomId/leave - Leave group
router.post("/rooms/:roomId/leave", authMiddleware, (req, res, next) => {
  chatController.leaveGroup(req, res).catch(next);
});

// DELETE /api/chat/rooms/:roomId - Delete group (admin only)
router.delete("/rooms/:roomId", authMiddleware, (req, res, next) => {
  chatController.deleteGroup(req, res).catch(next);
});

module.exports = router;
