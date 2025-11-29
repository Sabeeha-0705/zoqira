const express = require("express");
const router = express.Router();

const { uploadAudio } = require("../middleware/upload.middleware");
const {
  voiceChat,
  pronunciationCheck,
  getScenarios,
} = require("../controllers/communication.controller");
const { protect } = require("../middleware/auth.middleware");

// voice chat: temporary auth optional; protect if you want user-specific sessions
router.post("/voice-chat", uploadAudio.single("audio"), protect, voiceChat);
router.post(
  "/pronunciation-check",
  uploadAudio.single("audio"),
  protect,
  pronunciationCheck
);
router.get("/scenarios", getScenarios);

module.exports = router;
