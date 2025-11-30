const multer = require("multer");

// Memory storage for processing
const storage = multer.memoryStorage();

// File filter for attachments (images, audio, video, documents)
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "video/mp4",
    "video/webm",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB limit
  },
});

module.exports = uploadMiddleware;
