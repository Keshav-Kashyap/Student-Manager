const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateVerificationToken, sendVerificationEmail,sendPasswordResetEmail } = require('../utils/emailService');
const Student = require('../models/Student');
const Profile = require('../models/Profile');
const bcrypt = require('bcrypt');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Name, email, and password are required' 
      });
    }

    // Email validation
    if (!email.includes('@')) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a valid email address' 
      });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Generate verification token
    const token = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user with verification fields
    const user = await User.create({ 
      name: name.trim(), 
      email: email.toLowerCase(), 
      password, 
      role: role || 'teacher',
      emailVerificationToken: token,
      emailVerificationExpires: verificationExpires,
      isEmailVerified: false
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, token, name);
      console.log('✅ Verification email sent to:', email);
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError);
      // Don't fail registration if email fails, but log the error
    }

    console.log('✅ New user registered:', {
      name: user.name,
      email: user.email,
      role: user.role,
      id: user._id,
      emailVerified: user.isEmailVerified
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      requiresEmailVerification: true
    });

  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle specific MongoDB errors
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false,
        message: messages.join('. ') 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Registration failed', 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid Password' 
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
        requiresEmailVerification: true,
        email: user.email
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);
    
    // Set cookie
    res.cookie('jwt', token, {
      httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });


    

    console.log('✅ User logged in:', {
      name: user.name,
      email: user.email,
      id: user._id
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        hasProfile: user.hasProfile,
        createdAt: user.createdAt,
      }
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Login failed', 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Get current logged-in user
const getCurrentUser = async (req, res) => {
  try {
    // req.user.id is set by authMiddleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ 
      success: false,
      message: 'User fetch failed', 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    }));

    res.json({
      success: true,
      data: formattedUsers
    });

  } catch (error) {
    console.error('❌ Error getting all users:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Google Auth endpoints
const loadAuth = (req, res) => {
  res.send("✅ Google Auth endpoint hit!");
};

// controllers/userController.js - successGoogleLogin
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
       secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
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
    const errorMsg = "Login successful but failed to set session. Please try logging in again.";
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

// 4. Test route to check if user exists
const checkUserExists = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    return res.json({
      exists: !!user,
      hasGoogleId: user?.googleId ? true : false,
      email: email
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// Email verification
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    console.log('📧 Verifying token:', token);

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    console.log('Received token for verification:', token);

    // Find the user by email verification token (and check expiry)
  const user = await User.findOne({
  emailVerificationToken: token,
  emailVerificationExpires: { $gt: Date.now() },
}).select('+emailVerificationToken +emailVerificationExpires');


    if (!user) {
  console.log("❌ No user found with that token. Possible reasons:");
  console.log("- Token expired?");
  console.log("- Token not saved?");
  console.log("- select: false fields not included?");
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    console.log('✅ Email verified for user:', user.email);

    // ✅ Create JWT for login session
    const authToken = generateToken(user._id); // <-- This should be a valid JWT utility

    // ✅ Set JWT in cookie
    res.cookie('token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Respond with user data (NO JWT in body)
    return res.status(200).json({
      success: true,
      message: 'Email verified and logged in successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Email verification failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Email verification failed',
    });
  }
};


// Resend verification email
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isEmailVerified: false 
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or email already verified'
      });
    }

    // Generate new token
    const token = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = token;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send new verification email
    await sendVerificationEmail(email, token, user.name);

    console.log('✅ Verification email resent to:', email);

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully! Please check your inbox.'
    });

  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Logout user
const logoutUser = (req, res) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

const checkAuthStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(401).json({
        isAuthenticated: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      isAuthenticated: true,
      user,
      message: 'Authenticated'
    });
  } catch (error) {
    console.error('Auth status check error:', error);
    return res.status(500).json({
      isAuthenticated: false,
      message: 'Server error',
      error: error.message
    });
  }
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with that email' });
    }

    const token = generateVerificationToken();
    const expires = Date.now() + 60 * 60 * 1000; // 1 hour

    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(expires);
    await user.save();

    await sendPasswordResetEmail(email, token, user.name);

    res.status(200).json({ success: true, message: 'Reset link sent to email' });
  } catch (err) {
    console.error('❌ Forgot Password Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    }).select('+password');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // ✅ Password validation
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('❌ Reset Password Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  loadAuth,
  successGoogleLogin,
  failureGoogleLogin,
  verifyEmail,
  resendVerificationEmail,
  logoutUser,
checkAuthStatus,
resetPassword,
forgotPassword,
checkUserExists
};