const express = require("express");
const router = express.Router();
const {
  getMe,
  updateMe,
  getUserProfile,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// Protected routes
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);

// Public routes
router.get("/:id", getUserProfile);

// Admin routes
router.get("/", protect, authorize("admin"), getUsers);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
