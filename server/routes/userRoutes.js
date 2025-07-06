const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // ✅ Add missing import
const User = require('../models/User'); // ✅ Add missing import (adjust path as needed)

const {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  verifyEmail,
  resendVerificationEmail,
  checkAuthStatus,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');

// ✅ Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// ✅ Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.get('/profile', authMiddleware, getCurrentUser); // ✅ Fixed: Use getCurrentUser controller
router.get('/', authMiddleware, getAllUsers);
router.get('/status', authMiddleware, checkAuthStatus);

// ✅ Email verification routes
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// ✅ Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ✅ Session login route (fixed with proper imports)
router.post('/session-login', authMiddleware, async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // ✅ Create new session token
    const sessionToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('access_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ 
      success: true, 
      message: 'Session created', 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (err) {
    console.error('Session login error:', err);
    res.status(400).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
});

// ✅ Email verification middleware
const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      requiresEmailVerification: true
    });
  }
  next();
};

module.exports = router;