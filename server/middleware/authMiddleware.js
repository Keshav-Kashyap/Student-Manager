const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Headers:', req.headers);
    
    // Get token from header
    let token = req.header('Authorization');
    console.log('Raw Authorization header:', token);
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.bsdk token leke aa'
      });
    }

    // Remove Bearer prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }
    
    console.log('Token after processing:', token);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // 🔥 FIX: Use correct property name from token
    // Your registerUser और loginUser में आप userId store कर रहे हैं, id नहीं
    const userId = decoded.userId || decoded.id;
    
    if (!userId) {
      console.log('No userId found in token');
      return res.status(401).json({
        success: false,
        message: 'Invalid token format. No user ID found.'
      });
    }
    
    // Find user
    const user = await User.findById(userId).select('-password');
    console.log('Found user:', user);
    
    if (!user) {
      console.log('User not found for token');
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Add user to request object
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    console.log('Auth successful, user set:', req.user);
    next();
    
  } catch (error) {
    console.error('=== AUTH MIDDLEWARE ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error in authentication.',
      error: error.message
    });
  }
};

module.exports = authMiddleware;