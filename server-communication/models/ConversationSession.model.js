const mongoose = require("mongoose");

const turnSchema = new mongoose.Schema({
  speaker: { type: String, enum: ["user", "bot"], required: true },
  text: { type: String },
  audioUrl: { type: String },
  timestamp: { type: Date, default: Date.now },
  score: { type: Number },
});

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    scenario: { type: String, default: "casual" },
    turns: [turnSchema],
    totalScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ConversationSession = mongoose.model(
  "ConversationSession",
  conversationSchema
);
module.exports = ConversationSession;
