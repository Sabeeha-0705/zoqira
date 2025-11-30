const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    name: {
      type: String,
      required: function () {
        return this.type === "group";
      },
      maxlength: 100,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    isRequestBased: {
      type: Boolean,
      default: false, // true for initial request-based direct chats
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastMessage: {
      text: String,
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: Date,
    },
  },
  { timestamps: true }
);

// Index for finding rooms by members for faster queries
chatRoomSchema.index({ "members.user": 1 });

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
