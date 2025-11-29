const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { generateAccessToken } = require("../utils/jwt.util");

// Basic placeholder auth routes: register & login
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({ name, email, passwordHash: hash });
    await user.save();
    const token = generateAccessToken(user._id);
    res
      .status(201)
      .json({
        user: { id: user._id, name: user.name, email: user.email },
        accessToken: token,
      });
  } catch (err) {
    console.error("register error", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = generateAccessToken(user._id);
    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      accessToken: token,
    });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
