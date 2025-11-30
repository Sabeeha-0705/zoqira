const mongoose = require("mongoose");

const chatRequestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    initialMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Index for finding requests by user
chatRequestSchema.index({ to: 1, status: 1 });
chatRequestSchema.index({ from: 1 });

module.exports = mongoose.model("ChatRequest", chatRequestSchema);
