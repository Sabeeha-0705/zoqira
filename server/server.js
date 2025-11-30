const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.MOBILE_CLIENT_URL],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/aptitude", require("./routes/aptitude.routes"));
app.use("/api/communication", require("./routes/communication.routes"));
app.use("/api/settings", require("./routes/settings.routes"));
app.use("/api/profile", require("./routes/profile.routes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "ZOQIRA API Server is running" });
});

// Error handling middleware
app.use(require("./middleware/error.middleware"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 ZOQIRA Server running on port ${PORT}`);
});
