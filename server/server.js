const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');


// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); //  Add this line

const studentRoutes = require('./routes/studentRoutes');
const profileRoutes = require('./routes/profileRoutes');
const createAdmin = require('./routes/createAdminRoutes')
const adminRoute = require('./routes/adminRoute')



dotenv.config();
const app = express();
app.set('trust proxy', 1);

//  CORS setup — allow all origins for development, restrict for production
const allowedOrigins = [
  'https://surajprinting.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://student-manager-client.onrender.com'
];



// app.use('/create-admin', createAdmin)
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));



//  Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({
  resave: false,
  saveUninitialized: false, //  safer & recommended
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true, //  change to true in production with https
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));
app.use(passport.initialize());
app.use(passport.session());
//  Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.headers.authorization) {
    console.log('Auth Header Present:', req.headers.authorization.substring(0, 20) + '...');
  }
  if (req.headers['x-user-id']) {
    console.log('User ID Header:', req.headers['x-user-id']);
  }
  next();
});


app.use('/auth', authRoutes);


//  Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(' MongoDB connected successfully'))
  .catch(err => {
    console.error(' MongoDB connection error:', err);
    process.exit(1);
  });

//  Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Student Management Backend is live!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    routes: [
      '/api/users',
      '/api/students',
      '/api/profile',
      '/api/admin/dashboard',
    ]
  });
});

//  API Routes with proper error handling
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoute);


//  Route not found handler
app.use('*', (req, res) => {
  console.log(` Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'POST /api/users/register',
      'POST /api/users/login',
      'GET /api/students',
      'POST /api/students',
      'GET /api/profile'
    ]
  });
});

//  Global error handler
app.use((err, req, res, next) => {
  console.error(' Global Error:', err.stack);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field error',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

//  Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

//  Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Base URL: http://localhost:${PORT}`);
});