const multer = require("multer");

const memoryStorage = multer.memoryStorage();

const audioFilter = (req, file, cb) => {
  const allowed = [
    "audio/wav",
    "audio/x-wav",
    "audio/mpeg",
    "audio/mp3",
    "audio/ogg",
    "audio/webm",
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Unsupported audio format"), false);
};

const uploadAudio = multer({
  storage: memoryStorage,
  fileFilter: audioFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});

module.exports = { uploadAudio };
