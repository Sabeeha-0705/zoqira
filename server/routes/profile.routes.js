const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/auth.middleware");
const {
  validateProfileUpdate,
  validateUsername,
  handleValidationErrors,
} = require("../middleware/validation.middleware");
const {
  getPublicProfile,
  updateProfile,
  uploadAvatar,
} = require("../controllers/profile.controller");

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Accept image files only
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (JPEG, PNG, WebP, GIF)"));
    }
  },
});

/**
 * @route   GET /api/profile/:username
 * @desc    Get public user profile by username
 * @access  Public
 */
router.get(
  "/:username",
  validateUsername,
  handleValidationErrors,
  getPublicProfile
);

/**
 * @route   PATCH /api/profile/me
 * @desc    Update user profile (name, bio, location, birthday, gender)
 * @access  Private
 */
router.patch(
  "/me",
  protect,
  validateProfileUpdate,
  handleValidationErrors,
  updateProfile
);

/**
 * @route   POST /api/profile/upload-avatar
 * @desc    Upload user avatar to Cloudinary
 * @access  Private
 */
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);

module.exports = router;
