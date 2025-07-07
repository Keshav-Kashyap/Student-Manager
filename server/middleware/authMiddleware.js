const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE ===');

   let token = null;

if (req.cookies && req.cookies.jwt) {
  token = req.cookies.jwt;
  console.log('🟢 Token from cookie (jwt):', token);
  console.log('🍪 Incoming Cookies:', req.cookies);
} else {
  return res.status(401).json({
    success: false,
    message: 'Access denied. No token provided.',
  });
}

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. No user ID found.',
      });
    }

    // Attach user to request
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('AUTH MIDDLEWARE ERROR:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
    }
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

module.exports = authMiddleware;
