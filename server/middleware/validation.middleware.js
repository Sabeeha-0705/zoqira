const { body, param, validationResult } = require("express-validator");

// Validation middleware for settings updates
exports.validateSettings = [
  body("theme")
    .optional()
    .isIn(["light", "dark", "auto"])
    .withMessage("Invalid theme value"),
  body("language")
    .optional()
    .isIn(["en", "es", "fr", "de", "hi", "ar"])
    .withMessage("Invalid language"),
  body("preferences.aptitudeLevel")
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Invalid aptitude level"),
  body("preferences.aiHistoryEnabled")
    .optional()
    .isBoolean()
    .withMessage("aiHistoryEnabled must be a boolean"),
];

exports.validatePrivacy = [
  body("privacy.whoCanMessage")
    .optional()
    .isIn(["everyone", "friends", "nobody"])
    .withMessage("Invalid whoCanMessage value"),
  body("privacy.readReceipts")
    .optional()
    .isBoolean()
    .withMessage("readReceipts must be a boolean"),
  body("privacy.showOnlineStatus")
    .optional()
    .isBoolean()
    .withMessage("showOnlineStatus must be a boolean"),
  body("privacy.typingIndicator")
    .optional()
    .isBoolean()
    .withMessage("typingIndicator must be a boolean"),
];

exports.validateNotifications = [
  body("notifications.messages")
    .optional()
    .isBoolean()
    .withMessage("messages must be a boolean"),
  body("notifications.calls")
    .optional()
    .isBoolean()
    .withMessage("calls must be a boolean"),
  body("notifications.groups")
    .optional()
    .isBoolean()
    .withMessage("groups must be a boolean"),
  body("notifications.friendRequests")
    .optional()
    .isBoolean()
    .withMessage("friendRequests must be a boolean"),
];

exports.validateProfileUpdate = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must not exceed 500 characters"),
  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location must not exceed 100 characters"),
  body("birthday")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format")
    .custom((value) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 13) {
        throw new Error("User must be at least 13 years old");
      }
      return true;
    }),
  body("gender")
    .optional()
    .isIn(["male", "female", "other", "not-specified"])
    .withMessage("Invalid gender value"),
];

exports.validateUsername = [
  param("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and hyphens"
    ),
];

// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }
  next();
};
