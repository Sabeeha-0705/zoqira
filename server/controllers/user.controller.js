const User = require("../models/User.model");

// @desc Get current user profile
// GET /api/users/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update user profile
// PATCH /api/users/me
exports.updateMe = async (req, res, next) => {
  try {
    const { name, bio, skills, avatarUrl } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = skills;
    if (avatarUrl) user.avatarUrl = avatarUrl;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get public user profile
// GET /api/users/:id
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email username role createdAt"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Legacy endpoints (stubs)
exports.getUsers = async (req, res, next) => {
  res.status(501).json({ message: "Get users endpoint - to be implemented" });
};

exports.getUser = async (req, res, next) => {
  res.status(501).json({ message: "Get user endpoint - to be implemented" });
};

exports.updateUser = async (req, res, next) => {
  res.status(501).json({ message: "Update user endpoint - to be implemented" });
};

exports.deleteUser = async (req, res, next) => {
  res.status(501).json({ message: "Delete user endpoint - to be implemented" });
};
