const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Fixed: Import from config, not utils

const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  deleteMultipleStudents,
  searchStudents,
  getStudentStats
} = require('../controllers/studentController');

// Import proper auth middleware
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Multer setup for photo upload with CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Fixed: Use the cloudinary config
  params: {
    folder: 'studentPhotos', // Fixed: Corrected typo
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'limit' }],
    public_id: (req, file) => {
      // Generate unique public_id for each image
      return `student_${Date.now()}_${Math.round(Math.random() * 1E9)}`;
    }
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer configuration
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }
  
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files (jpg, jpeg, png, gif, webp) are allowed!'
    });
  }
  
  next(err);
};

// Debug route WITHOUT auth to test server
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Student routes are working',
    timestamp: new Date(),
    cloudinaryConfig: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not Set',
      api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'
    }
  });
});

// Apply auth middleware to all protected routes
router.use(authMiddleware);

// Debug route to check auth AFTER middleware
router.get('/debug', (req, res) => {
  res.json({
    success: true,
    message: 'Auth working properly',
    user: req.user,
    headers: {
      'x-user-id': req.headers['x-user-id'],
      authorization: req.headers.authorization ? 'Present' : 'Not Present'
    },
    timestamp: new Date()
  });
});

// Protected routes with proper authentication
// Note: Order matters! More specific routes should come before generic ones

// Statistics route
router.get('/stats', getStudentStats);

// Search route (must come before /:id to avoid conflicts)
router.get('/search', searchStudents);

// Get all students
router.get('/', getAllStudents);

// Get single student by ID
router.get('/:id', getStudentById);

// Create new student with photo upload
router.post('/', upload.single('photo'), handleMulterError, createStudent);

// Update student with optional photo upload
router.put('/:id', upload.single('photo'), handleMulterError, updateStudent);

// Delete single student
router.delete('/:id', deleteStudent);

// Batch delete students
router.delete('/', deleteMultipleStudents);

// Error handling middleware for the entire router
router.use((err, req, res, next) => {
  console.error('Student route error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error in student routes'
  });
});

module.exports = router;