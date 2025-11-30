const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must not exceed 30 characters"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Profile fields
    bio: {
      type: String,
      maxlength: [500, "Bio must not exceed 500 characters"],
      default: "",
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      maxlength: [100, "Location must not exceed 100 characters"],
      default: "",
    },
    birthday: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "not-specified"],
      default: "not-specified",
    },
    // Refresh token stored for session management (rotating tokens can be implemented)
    refreshToken: {
      type: String,
      select: false,
      default: null,
    },
    // Email verification token
    emailVerificationToken: {
      type: String,
      select: false,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
    },
    // Password reset token
    resetPasswordToken: {
      type: String,
      select: false,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
