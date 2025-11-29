const jwt = require("jsonwebtoken");

// Generate access token (short-lived)
exports.generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Generate refresh token (long-lived)
exports.generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: process.env.REFRESH_EXPIRES || "30d",
    }
  );
};

// Verify access token
exports.verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Verify refresh token
exports.verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
  );
};

// Legacy: for backward compatibility
exports.generateToken = (id) => {
  return exports.generateAccessToken(id);
};

exports.verifyToken = (token) => {
  return exports.verifyAccessToken(token);
};
