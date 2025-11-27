const jwt = require('jsonwebtoken');

// Generate JWT Token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Verify JWT Token
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

