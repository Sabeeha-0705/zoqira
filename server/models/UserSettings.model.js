const mongoose = require("mongoose");

const userSettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // UI & Language preferences
    theme: {
      type: String,
      enum: ["light", "dark", "auto"],
      default: "auto",
    },
    language: {
      type: String,
      enum: ["en", "es", "fr", "de", "hi", "ar"],
      default: "en",
    },
    // Notification settings
    notifications: {
      messages: {
        type: Boolean,
        default: true,
      },
      calls: {
        type: Boolean,
        default: true,
      },
      groups: {
        type: Boolean,
        default: true,
      },
      friendRequests: {
        type: Boolean,
        default: true,
      },
    },
    // Privacy settings
    privacy: {
      whoCanMessage: {
        type: String,
        enum: ["everyone", "friends", "nobody"],
        default: "everyone",
      },
      readReceipts: {
        type: Boolean,
        default: true,
      },
      showOnlineStatus: {
        type: Boolean,
        default: true,
      },
      typingIndicator: {
        type: Boolean,
        default: true,
      },
    },
    // Voice bot preferences
    voiceBot: {
      language: {
        type: String,
        enum: ["en", "es", "fr", "de", "hi"],
        default: "en",
      },
      gender: {
        type: String,
        enum: ["male", "female"],
        default: "female",
      },
      speed: {
        type: Number,
        min: 0.5,
        max: 2,
        default: 1,
      },
    },
    // User preferences
    preferences: {
      aptitudeLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "intermediate",
      },
      aiHistoryEnabled: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
userSettingsSchema.index({ user: 1 });

module.exports = mongoose.model("UserSettings", userSettingsSchema);
