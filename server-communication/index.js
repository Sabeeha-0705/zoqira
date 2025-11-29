require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

const connectDB = require("./config/db");

// Routes
const communicationRoutes = require("./routes/communication.routes");
const authRoutes = require("./routes/auth.routes");

const { errorHandler } = require("./middleware/error.middleware");

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Multer setup for audio (in-memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});
app.set("upload", upload);

// Routes
app.use("/api/communication", communicationRoutes);
app.use("/api/auth", authRoutes);

// Health
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", now: new Date() })
);

// Serve uploads in dev (only when STORAGE_PROVIDER is not configured)
const uploadsDir = path.join(__dirname, "uploads");
if (!process.env.STORAGE_PROVIDER || process.env.STORAGE_PROVIDER === "none") {
  app.use("/uploads", express.static(uploadsDir));
}

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server-communication running on port ${PORT}`);
});
