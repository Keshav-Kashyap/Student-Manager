const express = require('express');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin')
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Fixed: Import from config, not utils
 const Student = require('../models/Student');
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
// routes/studentRoutes.js
router.get('/user/:userId', async (req, res) => {
  try {
    const students = await Student.find({ createdBy: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.get('/stats', getStudentStats);

// Search route (must come before /:id to avoid conflicts)
router.get('/search', searchStudents);

// NEW: Print status update route for multiple students
router.put('/update-print-status', auth, async (req, res) => {
  try {
    const { studentIds, printStatus, printedAt } = req.body;

    // Validate input
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Student IDs are required and should be an array' 
      });
    }

    if (!printStatus) {
      return res.status(400).json({ 
        success: false,
        message: 'Print status is required' 
      });
    }

    // Import Student model (add this at the top of file if not already imported)
   

    // Update multiple students' print status
   const updateResult = await Student.updateMany(
  { 
    _id: { $in: studentIds },
    createdBy: req.user.id // ✅ Security check: Only update own students
  },
  { 
   $set: {
  printStatus: printStatus,
  printedAt: printedAt || new Date(),
  updatedAt: new Date(),
  updatedAfterPrint: ['printed', 'sent_to_print'].includes(printStatus) ? false : true
}

  }
);

    // Check if any documents were updated
    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No students found with provided IDs or access denied' 
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully updated print status for ${updateResult.modifiedCount} students`,
      data: {
        updatedCount: updateResult.modifiedCount,
        printStatus: printStatus,
        printedAt: printedAt || new Date()
      }
    });

  } catch (error) {
    console.error('Error updating print status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error while updating print status',
      error: error.message 
    });
  }
});

// NEW: Individual student print status update route
router.put('/:id/print-status' , auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { printStatus, printedAt } = req.body;

    if (!printStatus) {
      return res.status(400).json({ 
        success: false,
        message: 'Print status is required' 
      });
    }

    // Import Student model (add this at the top of file if not already imported)
   

   const updatedStudent = await Student.findOneAndUpdate(
  { 
    _id: id,
    createdBy: req.user.id
  },
  { 
    printStatus: printStatus,
    printedAt: printedAt || new Date(),
    updatedAt: new Date(),
    updatedAfterPrint: ['printed', 'sent_to_print'].includes(printStatus) ? false : true
  },
  { new: true }
);

    if (!updatedStudent) {
      return res.status(404).json({ 
        success: false,
        message: 'Student not found or access denied' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Print status updated successfully',
      data: updatedStudent
    });

  } catch (error) {
    console.error('Error updating student print status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Get all students
router.get('/', getAllStudents);

// Get single student by ID
router.get('/:id',  getStudentById);

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


// GET /api/students/stats/printed-summary (for Admin)
// GET /api/students/stats/admin-printed-summary
router.get('/stats/admin-printed-summary', auth,isAdmin, async (req, res) => {
  try {
    const printedStudents = await Student.find({ printStatus: 'printed' });

    const totalPrints = printedStudents.length;

    // Group by date (e.g., YYYY-MM-DD)
    const dailyPrints = {};
    printedStudents.forEach(student => {
      const dateKey = new Date(student.printedAt).toISOString().split('T')[0];
      dailyPrints[dateKey] = (dailyPrints[dateKey] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      totalPrints,
      groupedByDate: dailyPrints
    });
  } catch (error) {
    console.error('Admin printed summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin printed summary',
      error: error.message
    });
  }
});



router.get('/stats/printed-by-user', async (req, res) => {
  try {
    const userWisePrints = await Student.aggregate([
      { $match: { printStatus: 'printed' } },
      {
        $group: {
          _id: "$createdBy",
          printedCount: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: userWisePrints
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Aggregation failed', error: err.message });
  }
});

// GET /api/students/stats/user → returns stats for logged-in user
router.get('/stats/user', async (req, res) => {
  try {
    const userId = req.user.id;

    const userPrinted = await Student.find({ 
      createdBy: userId, 
      printStatus: 'printed' 
    });

    const now = new Date();
    const today = now.toDateString();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayPrints = userPrinted.filter(s => new Date(s.printedAt).toDateString() === today).length;
    const thisWeekPrints = userPrinted.filter(s => new Date(s.printedAt) >= startOfWeek).length;
    const thisMonthPrints = userPrinted.filter(s => new Date(s.printedAt) >= startOfMonth).length;

    res.status(200).json({
      success: true,
      totalPrints: userPrinted.length,
      todayPrints,
      thisWeekPrints,
      thisMonthPrints,
      lastPrintDate: userPrinted.length > 0 
        ? new Date(Math.max(...userPrinted.map(s => new Date(s.printedAt).getTime())))
        : null
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user print stats',
      error: error.message
    });
  }
});




router.get("/view/:id", auth, isAdmin, async (req, res) => {
  const studentId = req.params.id;
  const userRole = req.user.role; // role from JWT (user or admin)

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (userRole === "admin") {
      // Allow admin to view any student
      return res.json(student);
    } else if (userRole === "user") {
      // Allow user to view only their own students
      if (student.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      return res.json(student);
    } else {
      return res.status(403).json({ message: "Role not allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;