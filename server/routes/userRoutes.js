const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  verifyEmail,           // 🆕 New
  resendVerificationEmail,
  checkAuthStatus ,
  forgotPassword,
  resetPassword,// 🆕 New
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/', authMiddleware, getAllUsers);

// 🆕 New email verification routes
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', getCurrentUser);


router.get('/status', authMiddleware, checkAuthStatus);
router.post('/session-login' ,authMiddleware, async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Create new session (or cookie)
    const sessionToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('access_token', sessionToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ success: true, message: 'Session created', user });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;



// 9. Add to your .env file
/*

*/

// 10. Optional: Create middleware to check email verification
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

// Use this middleware on protected routes that require verified email
// router.get('/protected-route', authMiddleware, requireEmailVerification, protectedController);