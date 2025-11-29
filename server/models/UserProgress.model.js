const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    topicStats: {
      type: Map,
      of: {
        attempts: { type: Number, default: 0 },
        correct: { type: Number, default: 0 },
        wrong: { type: Number, default: 0 },
        streak: { type: Number, default: 0 },
        lastAttempt: Date,
        nextReview: Date,
      },
      default: new Map(),
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    totalAttempts: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProgress", userProgressSchema);
