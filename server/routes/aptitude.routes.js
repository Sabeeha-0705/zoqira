const express = require("express");
const router = express.Router();

const {
  getCategories,
  getQuestionsByTopic,
  submitAttempt,
  getAttempts,
  getProgress,
} = require("../controllers/aptitude.controller");

const { protect } = require("../middleware/auth.middleware");

// Public routes
router.get("/categories", getCategories);
router.get("/topics/:topic/questions", getQuestionsByTopic);

// Protected routes
router.post("/attempts", protect, submitAttempt);
router.get("/attempts", protect, getAttempts);
router.get("/progress", protect, getProgress);

module.exports = router;
