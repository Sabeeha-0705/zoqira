const UserSettings = require("../models/UserSettings.model");
const User = require("../models/User.model");

/**
 * @desc    Get user settings
 * @route   GET /api/settings/me
 * @access  Private
 */
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await UserSettings.findOne({ user: req.user.id });

    // Create default settings if not found
    if (!settings) {
      settings = await UserSettings.create({ user: req.user.id });
    }

    res.status(200).json({
      success: true,
      message: "Settings retrieved successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Error in getSettings:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving settings",
      error: error.message,
    });
  }
};

/**
 * @desc    Update user settings (theme, language, preferences)
 * @route   PATCH /api/settings/me
 * @access  Private
 */
exports.updateSettings = async (req, res, next) => {
  try {
    const { theme, language, preferences } = req.body;

    let settings = await UserSettings.findOne({ user: req.user.id });

    // Create default settings if not found
    if (!settings) {
      settings = await UserSettings.create({ user: req.user.id });
    }

    // Update allowed fields
    if (theme) settings.theme = theme;
    if (language) settings.language = language;

    if (preferences) {
      if (preferences.aptitudeLevel) {
        settings.preferences.aptitudeLevel = preferences.aptitudeLevel;
      }
      if (typeof preferences.aiHistoryEnabled === "boolean") {
        settings.preferences.aiHistoryEnabled = preferences.aiHistoryEnabled;
      }
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Error in updateSettings:", error);
    res.status(500).json({
      success: false,
      message: "Error updating settings",
      error: error.message,
    });
  }
};

/**
 * @desc    Update privacy settings
 * @route   PATCH /api/settings/privacy
 * @access  Private
 */
exports.updatePrivacy = async (req, res, next) => {
  try {
    const { privacy } = req.body;

    if (!privacy) {
      return res.status(400).json({
        success: false,
        message: "Privacy object is required",
      });
    }

    let settings = await UserSettings.findOne({ user: req.user.id });

    // Create default settings if not found
    if (!settings) {
      settings = await UserSettings.create({ user: req.user.id });
    }

    // Update privacy fields
    if (privacy.whoCanMessage) {
      settings.privacy.whoCanMessage = privacy.whoCanMessage;
    }
    if (typeof privacy.readReceipts === "boolean") {
      settings.privacy.readReceipts = privacy.readReceipts;
    }
    if (typeof privacy.showOnlineStatus === "boolean") {
      settings.privacy.showOnlineStatus = privacy.showOnlineStatus;
    }
    if (typeof privacy.typingIndicator === "boolean") {
      settings.privacy.typingIndicator = privacy.typingIndicator;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Privacy settings updated successfully",
      data: settings.privacy,
    });
  } catch (error) {
    console.error("Error in updatePrivacy:", error);
    res.status(500).json({
      success: false,
      message: "Error updating privacy settings",
      error: error.message,
    });
  }
};

/**
 * @desc    Update notification settings
 * @route   PATCH /api/settings/notifications
 * @access  Private
 */
exports.updateNotifications = async (req, res, next) => {
  try {
    const { notifications } = req.body;

    if (!notifications) {
      return res.status(400).json({
        success: false,
        message: "Notifications object is required",
      });
    }

    let settings = await UserSettings.findOne({ user: req.user.id });

    // Create default settings if not found
    if (!settings) {
      settings = await UserSettings.create({ user: req.user.id });
    }

    // Update notification fields
    if (typeof notifications.messages === "boolean") {
      settings.notifications.messages = notifications.messages;
    }
    if (typeof notifications.calls === "boolean") {
      settings.notifications.calls = notifications.calls;
    }
    if (typeof notifications.groups === "boolean") {
      settings.notifications.groups = notifications.groups;
    }
    if (typeof notifications.friendRequests === "boolean") {
      settings.notifications.friendRequests = notifications.friendRequests;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Notification settings updated successfully",
      data: settings.notifications,
    });
  } catch (error) {
    console.error("Error in updateNotifications:", error);
    res.status(500).json({
      success: false,
      message: "Error updating notification settings",
      error: error.message,
    });
  }
};
