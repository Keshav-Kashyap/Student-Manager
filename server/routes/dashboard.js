// routes/dashboard.js
const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Adjust path according to your model
const User = require('../models/User'); // Adjust path according to your model
const auth = require('../middleware/authMiddleware'); // Your auth middleware

// GET /api/dashboard/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming auth middleware adds user to req

    // Count total students for this user
    const totalStudents = await Student.countDocuments({ createdBy: userId });

    // Count printed IDs
    const printedIds = await Student.countDocuments({ 
      createdBy: userId, 
      idPrinted: true 
    });

    // Count pending tasks (you can define what constitutes a "pending task")
    const pendingTasks = await Student.countDocuments({ 
      createdBy: userId, 
      status: 'pending' // or whatever field you use
    });

    // You can add more statistics as needed
    const stats = {
      totalStudents,
      printedIds,
      pendingTasks,
      totalActive: await Student.countDocuments({ 
        createdBy: userId, 
        status: 'active' 
      }),
      // Add more stats as needed
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching dashboard statistics',
      error: error.message 
    });
  }
});

// GET /api/dashboard/recent-students
router.get('/recent-students', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const recentStudents = await Student.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email rollNumber createdAt');

    res.json(recentStudents);
  } catch (error) {
    console.error('Recent students error:', error);
    res.status(500).json({ 
      message: 'Error fetching recent students',
      error: error.message 
    });
  }
});

module.exports = router;