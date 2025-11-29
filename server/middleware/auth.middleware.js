const User = require("../models/User.model");
const { verifyAccessToken } = require("../utils/jwt.util");

// Protect routes - Verify access token from Authorization header
exports.protect = async (req, res, next) => {
  let token;

  // Check Authorization header for Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access this route",
        });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: "Authorization failed",
      });
    }
  };
};
