const User = require("../models/User.model");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary (make sure CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET are in .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @desc    Get public user profile
 * @route   GET /api/profile/:username
 * @access  Public
 */
exports.getPublicProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      username: username.toLowerCase(),
    }).select("name username bio avatarUrl location gender createdAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in getPublicProfile:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving profile",
      error: error.message,
    });
  }
};

/**
 * @desc    Update user profile (private, authenticated user)
 * @route   PATCH /api/profile/me
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, location, birthday, gender } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (birthday) user.birthday = birthday;
    if (gender) user.gender = gender;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        location: user.location,
        birthday: user.birthday,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

/**
 * @desc    Upload user avatar to Cloudinary
 * @route   POST /api/profile/upload-avatar
 * @access  Private
 */
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old avatar if exists
    if (user.avatarUrl) {
      try {
        const publicId = user.avatarUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`zoqira/avatars/${publicId}`);
      } catch (err) {
        console.warn("Error deleting old avatar:", err.message);
      }
    }

    // Upload new avatar to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "zoqira/avatars",
          resource_type: "auto",
          width: 500,
          height: 500,
          crop: "fill",
          quality: "auto",
          format: "webp",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      const { Readable } = require("stream");
      Readable.from(req.file.buffer).pipe(uploadStream);
    });

    // Update user avatar URL
    user.avatarUrl = result.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      data: {
        avatarUrl: user.avatarUrl,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    console.error("Error in uploadAvatar:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading avatar",
      error: error.message,
    });
  }
};
