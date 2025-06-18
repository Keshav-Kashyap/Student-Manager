const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT generator
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    const user = await User.create({ name, email, password, role });

    // ✅ Show registered user in console
    console.log('✅ New user registered:', {
      name: user.name,
      email: user.email,
      role: user.role,
      id: user._id
    });

    // Generate token with consistent property name
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
     
    });
     console.log(user);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed', 
      error: err.message 
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    const user = await User.findOne({ email });
    console.log(email);
    console.log(user);
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = generateToken(user._id);
    
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
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Login failed', 
      error: err.message 
    });
  }
};

// Get current logged-in user
const getCurrentUser = async (req, res) => {
  try {
    // req.user.id is set by authMiddleware
    const user = await User.findById(req.user.id).select('-password');
    console.log(req.user.id);
    console.log(user);
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
      error: err.message 
    });
  }
};

module.exports = { registerUser, loginUser, getCurrentUser };