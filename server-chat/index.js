require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const { connectDB } = require("./config/db");
const errorMiddleware = require("./middleware/error.middleware");
const rateLimitMiddleware = require("./middleware/rateLimit.middleware");

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");

// Import Socket handler
const initializeSocketHandler = require("./socket/socket.handler");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// TODO: Configure Redis adapter for scaling Socket.IO across multiple instances
// if (process.env.REDIS_URL) {
//   const { createAdapter } = require('@socket.io/redis-adapter');
//   const redis = require('redis');
//   const pubClient = redis.createClient({ url: process.env.REDIS_URL });
//   const subClient = pubClient.duplicate();
//   Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
//     io.adapter(createAdapter(pubClient, subClient));
//   });
// }

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimitMiddleware);

// Static file serving for uploads (development)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// Socket.IO handler
initializeSocketHandler(io);

// Attach io to app for potential use in routes
app.set("io", io);

// Error handling middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`\n✓ Chat server running on http://localhost:${PORT}`);
      console.log(`✓ Socket.IO listening on ws://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server, io };
