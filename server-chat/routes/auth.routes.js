const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const User = require("../models/User.model");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt.util");
const { body, validationResult } = require("express-validator");

// POST /api/auth/register
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, username, email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email or username already exists" });
      }

      // Create new user
      const user = new User({
        name,
        username,
        email,
        passwordHash: password,
      });

      await user.save();

      const accessToken = generateAccessToken(
        user._id,
        user.email,
        user.roles[0]
      );
      const refreshToken = generateRefreshToken(user._id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
        accessToken,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+passwordHash");

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const accessToken = generateAccessToken(
        user._id,
        user.email,
        user.roles[0]
      );
      const refreshToken = generateRefreshToken(user._id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
        accessToken,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// POST /api/auth/refresh
router.post("/refresh", (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken(decoded.userId);

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
