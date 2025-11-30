const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/zoqira-chat";

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✓ MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("✗ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
