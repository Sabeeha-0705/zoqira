const ChatRoom = require("../models/ChatRoom.model");
const Message = require("../models/Message.model");
const ChatRequest = require("../models/ChatRequest.model");
const User = require("../models/User.model");
const Presence = require("../models/Presence.model");
const NotificationService = require("../services/notification.service");
const { uploadFile, getFileUrl } = require("../utils/storage");

// Send initial chat request
const sendChatRequest = async (req, res) => {
  try {
    const { toUserId, text } = req.body;
    const fromUserId = req.user.id;

    if (!toUserId) {
      return res.status(400).json({ message: "toUserId is required" });
    }

    if (fromUserId === toUserId) {
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });
    }

    // Check if users exist
    const [fromUser, toUser] = await Promise.all([
      User.findById(fromUserId),
      User.findById(toUserId),
    ]);

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Check if request already exists
    const existingRequest = await ChatRequest.findOne({
      from: fromUserId,
      to: toUserId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    // Check if room already exists (request-based or already connected)
    const existingRoom = await ChatRoom.findOne({
      type: "direct",
      "members.user": { $all: [fromUserId, toUserId] },
    });

    if (existingRoom) {
      return res
        .status(400)
        .json({ message: "Room already exists with this user" });
    }

    // Create chat room
    const room = new ChatRoom({
      type: "direct",
      isRequestBased: true,
      members: [
        { user: fromUserId },
        { user: toUserId }, // Not joined yet until they accept
      ],
      createdBy: fromUserId,
    });

    await room.save();

    // Create initial message with request status
    const message = new Message({
      room: room._id,
      sender: fromUserId,
      text: text || `Hey! Let's chat.`,
      requestStatus: "pending",
      system: true,
    });

    await message.save();

    // Create chat request tracking
    const chatRequest = new ChatRequest({
      from: fromUserId,
      to: toUserId,
      initialMessageId: message._id,
      status: "pending",
    });

    await chatRequest.save();

    // Send notification
    await NotificationService.sendChatRequestNotification(toUser, fromUser);

    res.status(201).json({
      roomId: room._id,
      message: {
        id: message._id,
        text: message.text,
        requestStatus: message.requestStatus,
        createdAt: message.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Respond to chat request (accept or reject)
const respondToChatRequest = async (req, res) => {
  try {
    const { roomId, action } = req.body;
    const userId = req.user.id;

    if (!roomId || !action || !["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid roomId or action" });
    }

    const room = await ChatRoom.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.isRequestBased) {
      return res
        .status(400)
        .json({ message: "This room is not request-based" });
    }

    const chatRequest = await ChatRequest.findOne({
      initialMessageId: { $exists: true },
      initialMessageId: Message.findOne({
        room: roomId,
        requestStatus: "pending",
      })._id,
    }).populate("from to");

    // More efficient query
    const initialMessage = await Message.findOne({
      room: roomId,
      requestStatus: "pending",
    });

    if (!initialMessage) {
      return res.status(404).json({ message: "Request message not found" });
    }

    const request = await ChatRequest.findOne({
      initialMessageId: initialMessage._id,
    }).populate("from to");

    if (!request) {
      return res.status(404).json({ message: "Chat request not found" });
    }

    if (request.to._id.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only recipient can respond to request" });
    }

    if (action === "accept") {
      // Update request status
      request.status = "accepted";
      await request.save();

      // Update message status
      initialMessage.requestStatus = "accepted";
      await initialMessage.save();

      // Update room: mark as accepted (no longer request-based), add both users to members
      room.isRequestBased = false;
      room.members = [
        { user: request.from._id, joinedAt: new Date() },
        { user: request.to._id, joinedAt: new Date() },
      ];
      await room.save();

      res.status(200).json({
        roomId: room._id,
        status: "accepted",
        message: "Request accepted",
      });
    } else if (action === "reject") {
      // Update request status
      request.status = "rejected";
      await request.save();

      // Update message status
      initialMessage.requestStatus = "rejected";
      await initialMessage.save();

      res.status(200).json({
        status: "rejected",
        message: "Request rejected",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send direct message (only after request accepted or for non-request rooms)
const sendDirectMessage = async (req, res) => {
  try {
    const { roomId, text } = req.body;
    const userId = req.user.id;

    if (!roomId || !text) {
      return res.status(400).json({ message: "roomId and text are required" });
    }

    const room = await ChatRoom.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.type !== "direct") {
      return res
        .status(400)
        .json({ message: "This is not a direct chat room" });
    }

    // Check if user is member and request is accepted
    const isMember = room.members.some((m) => m.user.toString() === userId);

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this room" });
    }

    if (room.isRequestBased) {
      return res.status(400).json({
        message:
          "Cannot send message on pending request. Accept the request first.",
      });
    }

    // Create message
    const message = new Message({
      room: roomId,
      sender: userId,
      text,
    });

    // Handle file attachment
    if (req.file) {
      const fileUpload = await uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      message.attachments.push({
        url: fileUpload.url,
        type: req.file.mimetype.startsWith("image/") ? "image" : "file",
        fileName: req.file.originalname,
        fileSize: req.file.size,
      });
    }

    await message.save();

    // Update room's last message
    room.lastMessage = {
      text: message.text,
      senderId: userId,
      createdAt: message.createdAt,
    };
    await room.save();

    res.status(201).json({
      messageId: message._id,
      roomId: message.room,
      text: message.text,
      attachments: message.attachments,
      createdAt: message.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create group chat
const createGroupChat = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.user.id;

    if (!name || !Array.isArray(members) || members.length === 0) {
      return res
        .status(400)
        .json({ message: "name and members array are required" });
    }

    // Ensure creator is in members
    if (!members.includes(userId)) {
      members.push(userId);
    }

    // Fetch all member users to verify they exist
    const memberUsers = await User.find({ _id: { $in: members } });

    if (memberUsers.length !== members.length) {
      return res.status(400).json({ message: "One or more members not found" });
    }

    const room = new ChatRoom({
      type: "group",
      name,
      members: members.map((m) => ({ user: m })),
      admins: [userId],
      createdBy: userId,
    });

    // Handle group avatar
    if (req.file) {
      const avatarUpload = await uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      room.avatarUrl = avatarUpload.url;
    }

    await room.save();

    res.status(201).json({
      roomId: room._id,
      name: room.name,
      type: room.type,
      members: room.members,
      createdAt: room.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Invite members to group
const inviteToGroup = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { newMembers } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(newMembers) || newMembers.length === 0) {
      return res.status(400).json({ message: "newMembers array is required" });
    }

    const room = await ChatRoom.findById(roomId);

    if (!room || room.type !== "group") {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is admin
    if (!room.admins.includes(userId)) {
      return res
        .status(403)
        .json({ message: "Only admins can invite members" });
    }

    // Add new members
    const existingMemberIds = room.members.map((m) => m.user.toString());
    const membersToAdd = newMembers.filter(
      (m) => !existingMemberIds.includes(m)
    );

    for (const memberId of membersToAdd) {
      room.members.push({ user: memberId });

      // Send notification
      const invitee = await User.findById(memberId);
      const inviter = await User.findById(userId);
      if (invitee && inviter) {
        await NotificationService.sendGroupInviteNotification(
          invitee,
          inviter,
          room.name
        );
      }
    }

    await room.save();

    res.status(200).json({
      roomId: room._id,
      membersAdded: membersToAdd.length,
      message: "Members invited successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send group message
const sendGroupMessage = async (req, res) => {
  try {
    const { roomId, text } = req.params;
    const userId = req.user.id;

    if (!text) {
      return res.status(400).json({ message: "text is required" });
    }

    const room = await ChatRoom.findById(roomId);

    if (!room || room.type !== "group") {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is member
    const isMember = room.members.some((m) => m.user.toString() === userId);

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group" });
    }

    const message = new Message({
      room: roomId,
      sender: userId,
      text: req.body.text, // Use from body, not params
    });

    // Handle file attachment
    if (req.file) {
      const fileUpload = await uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      message.attachments.push({
        url: fileUpload.url,
        type: req.file.mimetype.startsWith("image/") ? "image" : "file",
        fileName: req.file.originalname,
        fileSize: req.file.size,
      });
    }

    await message.save();

    // Update room's last message
    room.lastMessage = {
      text: message.text,
      senderId: userId,
      createdAt: message.createdAt,
    };
    await room.save();

    res.status(201).json({
      messageId: message._id,
      roomId: message.room,
      text: message.text,
      attachments: message.attachments,
      createdAt: message.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rooms for current user with unread counts
const getRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    const rooms = await ChatRoom.find({ "members.user": userId })
      .populate("members.user", "name username avatarUrl")
      .populate("lastMessage.senderId", "name")
      .sort({ "lastMessage.createdAt": -1 });

    // Compute unread counts
    const roomsWithUnread = await Promise.all(
      rooms.map(async (room) => {
        const unreadCount = await Message.countDocuments({
          room: room._id,
          $nor: [{ readBy: userId }],
          sender: { $ne: userId },
        });

        return {
          roomId: room._id,
          type: room.type,
          name: room.name || room.members.map((m) => m.user.name).join(", "),
          members: room.members.map((m) => ({
            id: m.user._id,
            name: m.user.name,
            username: m.user.username,
            avatar: m.user.avatarUrl,
          })),
          lastMessage: room.lastMessage,
          unreadCount,
        };
      })
    );

    res.status(200).json({ rooms: roomsWithUnread });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get message history (paginated)
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, before } = req.query;
    const userId = req.user.id;

    const room = await ChatRoom.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is member
    const isMember = room.members.some((m) => m.user.toString() === userId);

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this room" });
    }

    let query = { room: roomId };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate("sender", "name username avatarUrl")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      messages: messages.reverse(),
      count: messages.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark messages as read
const markMessagesAsRead = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const result = await Message.updateMany(
      { room: roomId, $nor: [{ readBy: userId }] },
      { $push: { readBy: userId } }
    );

    res.status(200).json({
      modifiedCount: result.modifiedCount,
      message: "Messages marked as read",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Leave group
const leaveGroup = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const room = await ChatRoom.findById(roomId);

    if (!room || room.type !== "group") {
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove user from members
    room.members = room.members.filter((m) => m.user.toString() !== userId);

    // Remove from admins if present
    room.admins = room.admins.filter((a) => a.toString() !== userId);

    // If no members left, delete the room
    if (room.members.length === 0) {
      await ChatRoom.deleteOne({ _id: roomId });
      return res
        .status(200)
        .json({ message: "Group deleted as no members remain" });
    }

    // If user was last admin, assign first remaining member as admin
    if (room.admins.length === 0 && room.members.length > 0) {
      room.admins.push(room.members[0].user);
    }

    await room.save();

    res.status(200).json({
      message: "Left group successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete group (admin only)
const deleteGroup = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const room = await ChatRoom.findById(roomId);

    if (!room || room.type !== "group") {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!room.admins.includes(userId)) {
      return res
        .status(403)
        .json({ message: "Only admins can delete the group" });
    }

    await ChatRoom.deleteOne({ _id: roomId });
    await Message.deleteMany({ room: roomId });

    res.status(200).json({
      message: "Group deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendChatRequest,
  respondToChatRequest,
  sendDirectMessage,
  createGroupChat,
  inviteToGroup,
  sendGroupMessage,
  getRooms,
  getMessages,
  markMessagesAsRead,
  leaveGroup,
  deleteGroup,
};
