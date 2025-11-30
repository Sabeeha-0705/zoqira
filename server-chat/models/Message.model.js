const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
      maxlength: 5000,
    },
    attachments: [
      {
        url: String,
        type: {
          type: String,
          enum: ["image", "video", "audio", "file"],
        },
        fileName: String,
        fileSize: Number,
      },
    ],
    system: {
      type: Boolean,
      default: false, // true for system messages like "request sent"
    },
    requestStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected", null],
      default: null,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    editedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster message queries
messageSchema.index({ room: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

module.exports = mongoose.model("Message", messageSchema);
