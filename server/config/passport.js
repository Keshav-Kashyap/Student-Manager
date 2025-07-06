// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "https://student-manager-backend-zbjw.onrender.com/auth/google/callback",
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log("🔍 Google Profile:", {
      id: profile.id,
      email: profile.email,
      name: profile.displayName
    });

    // Get state from callback URL
    const state = req.query.state;
    console.log("🔍 Auth state:", state);

    // ✅ 1. Check by googleId
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      console.log("✅ Found existing user by googleId:", existingUser.email);
      return done(null, existingUser);
    }

    // ✅ 2. Check by email (if already registered manually)
    const userWithEmail = await User.findOne({ email: profile.email });
    if (userWithEmail) {
      console.log("✅ Found existing user by email, linking Google account:", userWithEmail.email);
      // Link Google account to existing user
      userWithEmail.googleId = profile.id;
      await userWithEmail.save();
      return done(null, userWithEmail);
    }

    // ❌ 3. No user found - handle based on state
    if (state === 'signup') {
      // Create new user for signup
      console.log("✅ Creating new user for signup:", profile.email);
      const newUser = new User({
        email: profile.email,
        googleId: profile.id,
        name: profile.displayName,
        hasProfile: false,
        role: 'teacher', // Default role from your schema
        isEmailVerified: true // Google users are auto-verified
      });

      await newUser.save();
      return done(null, newUser);
    } else {
      // Login attempt - no account found
      console.log("❌ No user found for login:", profile.email);
      const error = new Error("NO_ACCOUNT_FOUND");
      error.email = profile.email;
      error.name = profile.displayName;
      error.googleId = profile.id;
      return done(error, null);
    }

  } catch (err) {
    console.error("❌ Passport strategy error:", err);
    return done(err, null);
  }
}));

// Success handler
const successGoogleLogin = async (req, res) => {
  try {
    const user = req.user;
    console.log("✅ Google login success for user:", user.email);

    // ✅ Generate new token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // ✅ Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ Determine if user has a profile
    const hasProfile = user.hasProfile === true;

    // ✅ Build redirect URL
    const redirectUrl = `${process.env.FRONTEND_URL}/google-redirect?success=true&isNew=${!hasProfile}`;
    console.log("🔁 Success redirect to:", redirectUrl);

    return res.redirect(redirectUrl);
  } catch (err) {
    console.error("❌ Google login success handler error:", err);
    const errorMsg = "Login successful but failed to set session. Please try again.";
    res.redirect(`${process.env.FRONTEND_URL}/google-redirect?error=${encodeURIComponent(errorMsg)}&type=error`);
  }
};

const failureGoogleLogin = (req, res) => {
  console.log("❌ Failure handler called");
  const errorMsg = "Google login failed. Please try again.";
  const redirectUrl = `${process.env.FRONTEND_URL}/google-redirect?error=${encodeURIComponent(errorMsg)}&type=error`;
  console.log("❌ Failure redirect to:", redirectUrl);
  return res.redirect(redirectUrl);
};

module.exports = {
  successGoogleLogin,
  failureGoogleLogin
};