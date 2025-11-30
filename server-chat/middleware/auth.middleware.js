const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Check Authorization header (Bearer token) or cookie
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

const socketAuthMiddleware = (socket, next) => {
  try {
    // Token from handshake query or Authorization header
    const token =
      socket.handshake.query.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    socket.email = decoded.email;
    next();
  } catch (error) {
    next(new Error("Token validation failed"));
  }
};

module.exports = { authMiddleware, socketAuthMiddleware };
