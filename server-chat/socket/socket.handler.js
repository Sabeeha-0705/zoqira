const Presence = require("../models/Presence.model");
const Message = require("../models/Message.model");
const { socketAuthMiddleware } = require("../middleware/auth.middleware");

const initializeSocketHandler = (io) => {
  // Middleware for socket authentication
  io.use(socketAuthMiddleware);

  io.on("connection", async (socket) => {
    try {
      const userId = socket.userId;
      console.log(`✓ User ${userId} connected with socket ${socket.id}`);

      // Update presence
      let presence = await Presence.findOne({ user: userId });

      if (!presence) {
        presence = new Presence({
          user: userId,
          socketIds: [socket.id],
          isOnline: true,
        });
      } else {
        presence.socketIds.push(socket.id);
        presence.isOnline = true;
        presence.lastSeen = new Date();
      }

      await presence.save();

      // Auto-join all user's rooms
      const ChatRoom = require("../models/ChatRoom.model");
      const rooms = await ChatRoom.find({ "members.user": userId });

      for (const room of rooms) {
        socket.join(room._id.toString());
      }

      // Broadcast presence update
      socket.broadcast.emit("presence:update", {
        userId,
        isOnline: true,
        lastSeen: new Date(),
      });

      // Handle message:send event
      socket.on("message:send", async (data) => {
        try {
          const { roomId, text } = data;

          // Message should be saved via REST API, this is just broadcast
          const message = await Message.findOne({
            room: roomId,
            sender: userId,
          })
            .sort({ createdAt: -1 })
            .limit(1);

          if (message) {
            io.to(roomId).emit("message:new", {
              messageId: message._id,
              roomId,
              sender: {
                id: userId,
                email: socket.email,
              },
              text: message.text,
              attachments: message.attachments,
              createdAt: message.createdAt,
            });
          }
        } catch (error) {
          socket.emit("error", { message: error.message });
        }
      });

      // Handle message:typing event
      socket.on("message:typing", (data) => {
        const { roomId } = data;
        socket.broadcast.to(roomId).emit("message:typing", {
          userId,
          roomId,
          isTyping: true,
        });
      });

      // Handle message:typing-stop event
      socket.on("message:typing-stop", (data) => {
        const { roomId } = data;
        socket.broadcast.to(roomId).emit("message:typing", {
          userId,
          roomId,
          isTyping: false,
        });
      });

      // Handle message:read event
      socket.on("message:read", async (data) => {
        try {
          const { roomId, messageIds } = data;

          await Message.updateMany(
            { _id: { $in: messageIds } },
            { $push: { readBy: userId } }
          );

          io.to(roomId).emit("message:read", {
            userId,
            messageIds,
          });
        } catch (error) {
          socket.emit("error", { message: error.message });
        }
      });

      // Handle request:sent event
      socket.on("request:sent", (data) => {
        const { toUserId, roomId } = data;
        // Notify recipient (if online) - push notification should come from REST API
        io.to(`user:${toUserId}`).emit("request:notify", {
          from: userId,
          roomId,
          message: "New chat request",
        });
      });

      // Handle request:responded event
      socket.on("request:responded", (data) => {
        const { fromUserId, roomId, action } = data;
        io.to(`user:${fromUserId}`).emit("request:response", {
          to: userId,
          roomId,
          action,
        });
      });

      // Handle group:member-joined event
      socket.on("group:member-joined", (data) => {
        const { roomId } = data;
        io.to(roomId).emit("group:member-joined", {
          userId,
          roomId,
        });
      });

      // Handle group:member-left event
      socket.on("group:member-left", (data) => {
        const { roomId } = data;
        socket.leave(roomId);
        io.to(roomId).emit("group:member-left", {
          userId,
          roomId,
        });
      });

      // Handle disconnect
      socket.on("disconnect", async () => {
        try {
          console.log(`✓ User ${userId} disconnected`);

          const presence = await Presence.findOne({ user: userId });

          if (presence) {
            presence.socketIds = presence.socketIds.filter(
              (id) => id !== socket.id
            );

            if (presence.socketIds.length === 0) {
              presence.isOnline = false;
              presence.lastSeen = new Date();
            }

            await presence.save();
          }

          socket.broadcast.emit("presence:update", {
            userId,
            isOnline: presence?.isOnline || false,
            lastSeen: presence?.lastSeen,
          });
        } catch (error) {
          console.error("Disconnect error:", error);
        }
      });
    } catch (error) {
      console.error("Socket connection error:", error);
      socket.disconnect();
    }
  });
};

module.exports = initializeSocketHandler;
