const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const User = require("../models/User.model");
const { body, validationResult } = require("express-validator");
const uploadMiddleware = require("../middleware/upload.middleware");

// GET /api/users/me - Get current user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      isVerified: user.isVerified,
      lastSeen: user.lastSeen,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/:id - Get public user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name username avatarUrl bio isVerified createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/users/me - Update profile
router.patch(
  "/me",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  [
    body("name").optional().trim().notEmpty(),
    body("bio").optional().trim().isLength({ max: 500 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (req.body.name) user.name = req.body.name;
      if (req.body.bio) user.bio = req.body.bio;

      // TODO: Handle avatar upload to storage provider
      if (req.file) {
        // const { uploadFile } = require('../utils/storage');
        // const result = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
        // user.avatarUrl = result.url;
      }

      await user.save();

      res.status(200).json({
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET /api/users/search?q=<query>&limit=20
router.get("/", async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Search by username (prefix), name (text index), and bio
    const query = {
      $or: [
        { username: new RegExp(`^${q}`, "i") }, // Prefix match on username
        { name: new RegExp(q, "i") }, // Partial match on name
        { bio: new RegExp(q, "i") }, // Partial match on bio
      ],
    };

    const users = await User.find(query)
      .select("id name username avatarUrl bio isVerified")
      .limit(parseInt(limit));

    res.status(200).json({
      results: users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
