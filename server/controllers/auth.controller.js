const crypto = require("crypto");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { generateToken } = require("../utils/jwt.util");
const sendEmail = require("../utils/sendEmail");

// Helpers
const buildSafeUser = (user) => {
  if (!user) return null;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
};

const generateRefreshToken = (userId) => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.REFRESH_EXPIRES || "30d",
  });
};

// @desc Register
// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, username, password } = req.body;

    // uniqueness
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }
    if (await User.findOne({ username: username.toLowerCase() })) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }

    // create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password,
    });

    // Email verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = verifyToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
    await user.save();

    // send verification email (stubbed)
    const verifyUrl = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/verify-email?token=${verifyToken}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      text: `Please verify your email by visiting: ${verifyUrl}`,
    });

    // tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    return res
      .status(201)
      .json({
        success: true,
        token: accessToken,
        refreshToken,
        user: buildSafeUser(user),
      });
  } catch (error) {
    return next(error);
  }
};

// @desc Login
// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password +refreshToken"
    );
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const match = await user.matchPassword(password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    return res
      .status(200)
      .json({
        success: true,
        token: accessToken,
        refreshToken,
        user: buildSafeUser(user),
      });
  } catch (error) {
    return next(error);
  }
};

// @desc Verify email
// GET /api/auth/verify-email?token=...
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "Token is required" });

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });

    user.isVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified" });
  } catch (error) {
    return next(error);
  }
};

// @desc Refresh access token
// POST /api/auth/refresh
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res
        .status(400)
        .json({ success: false, message: "Refresh token required" });

    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, secret);
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token not recognized" });
    }

    // rotate tokens
    const newAccess = generateToken(user._id);
    const newRefresh = generateRefreshToken(user._id);
    user.refreshToken = newRefresh;
    await user.save();

    return res
      .status(200)
      .json({ success: true, token: newAccess, refreshToken: newRefresh });
  } catch (error) {
    return next(error);
  }
};

// @desc Get current logged in user
// GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user: buildSafeUser(user) });
  } catch (error) {
    return next(error);
  }
};

// @desc Logout
// POST /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      // remove stored refresh token if matches
      const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
      try {
        const decoded = jwt.verify(refreshToken, secret);
        const user = await User.findById(decoded.id).select("+refreshToken");
        if (user && user.refreshToken === refreshToken) {
          user.refreshToken = null;
          await user.save();
        }
      } catch (err) {
        // ignore invalid token
      }
    }

    // clear cookie if used
    if (res.cookie)
      res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });

    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    return next(error);
  }
};

// @desc Forgot password - send reset email
// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res
        .status(200)
        .json({
          success: true,
          message: "If that email exists, a reset link has been sent",
        });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Password reset",
      text: `Reset: ${resetUrl}`,
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "If that email exists, a reset link has been sent",
      });
  } catch (error) {
    return next(error);
  }
};

// @desc Reset password
// POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res
        .status(400)
        .json({ success: false, message: "Token and password required" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });

    user.password = password; // will be hashed by pre-save
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.refreshToken = null; // invalidate sessions
    await user.save();

    const accessToken = generateToken(user._id);
    const newRefresh = generateRefreshToken(user._id);
    user.refreshToken = newRefresh;
    await user.save();

    return res
      .status(200)
      .json({ success: true, token: accessToken, refreshToken: newRefresh });
  } catch (error) {
    return next(error);
  }
};
