const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  validateSettings,
  validatePrivacy,
  validateNotifications,
  handleValidationErrors,
} = require("../middleware/validation.middleware");
const {
  getSettings,
  updateSettings,
  updatePrivacy,
  updateNotifications,
} = require("../controllers/settings.controller");

// All routes are protected (require authentication)

/**
 * @route   GET /api/settings/me
 * @desc    Get user settings
 * @access  Private
 */
router.get("/me", protect, getSettings);

/**
 * @route   PATCH /api/settings/me
 * @desc    Update user settings (theme, language, preferences)
 * @access  Private
 */
router.patch(
  "/me",
  protect,
  validateSettings,
  handleValidationErrors,
  updateSettings
);

/**
 * @route   PATCH /api/settings/privacy
 * @desc    Update privacy settings
 * @access  Private
 */
router.patch(
  "/privacy",
  protect,
  validatePrivacy,
  handleValidationErrors,
  updatePrivacy
);

/**
 * @route   PATCH /api/settings/notifications
 * @desc    Update notification settings
 * @access  Private
 */
router.patch(
  "/notifications",
  protect,
  validateNotifications,
  handleValidationErrors,
  updateNotifications
);

module.exports = router;
