// routes/auth.js (Fixed version)
const express = require('express');
const passport = require('passport');
const router = express.Router();
require('../config/passport');

const {
  loadAuth,
  successGoogleLogin,
  failureGoogleLogin,
} = require('../controllers/userController');

router.get('/', loadAuth);

// 🔐 Google Auth for LOGIN (existing users only)
router.get('/google/login',
  passport.authenticate('google', { 
    scope: ['email', 'profile'],
    state: 'login' // Pass state to identify this is login
  })
);

// 🔐 Google Auth for SIGNUP (create new users)
router.get('/google/signup',
  passport.authenticate('google', { 
    scope: ['email', 'profile'],
    state: 'signup' // Pass state to identify this is signup
  })
);

// 🔁 Common Callback - handles both login and signup
router.get('/google/callback', (req, res, next) => {
  const state = req.query.state;

  passport.authenticate('google', {
    failureRedirect: '/auth/failure'
  }, (err, user, info) => {
    console.log("🔍 Google callback:", { state, err, user: user?.email, info });

    if (err) {
      if (err.message === "NO_ACCOUNT_FOUND" && state === 'login') {
        const msg = `No account found with email ${err.email}. Please sign up first.`;
        const redirectUrl = `${process.env.FRONTEND_URL}/google-redirect?error=${encodeURIComponent(msg)}&type=error&email=${encodeURIComponent(err.email)}&action=signup`;
        console.log("❌ No account (login), redirect:", redirectUrl);
        return res.redirect(redirectUrl);
      }

      // Other error
      const redirectUrl = `${process.env.FRONTEND_URL}/google-redirect?error=${encodeURIComponent("Authentication failed.")}&type=error`;
      return res.redirect(redirectUrl);
    }

    if (!user) {
      const redirectUrl = `${process.env.FRONTEND_URL}/google-redirect?error=${encodeURIComponent("Authentication failed.")}&type=error`;
      return res.redirect(redirectUrl);
    }

    // ✅ Login user and redirect
    req.logIn(user, (err) => {
      if (err) {
        const redirectUrl = `${process.env.FRONTEND_URL}/google-redirect?error=${encodeURIComponent("Login failed.")}&type=error`;
        return res.redirect(redirectUrl);
      }
      return successGoogleLogin(req, res);
    });

  })(req, res, next);
});

// Keep these for backup
router.get('/success', successGoogleLogin);
router.get('/failure', failureGoogleLogin);

module.exports = router;
