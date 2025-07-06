const Student = require('../models/Student');

// ========== Helper Functions ==========
const getUserId = (req) => {
  if (req.user && req.user.id) return req.user.id;
  if (req.headers['x-user-id']) return req.headers['x-user-id'];
  if (req.query.userId) return req.query.userId;
  return null;
};

// ========== CREATE STUDENT ==========
const createStudent = async (req, res) => {
  try {
    const userId = getUserId(req);
   
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User identification required.' });
    }

    // With CloudinaryStorage, file is automatically uploaded
    // req.file.path contains the Cloudinary URL
    const photoURL = req.file ? req.file.path : null;
    console.log("URL=" + photoURL);

    const studentData = {
      name: req.body.name,
      class: req.body.class,
      phone: req.body.phone,
      address: req.body.address,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName,
      dateOfBirth: req.body.dateOfBirth,
      photoPath: photoURL,
      createdBy: userId
    };

    const student = new Student(studentData);
    await student.save();

    res.status(201).json({ success: true, message: 'Student created successfully', data: student });
  } catch (error) {
    const message = error.name === 'ValidationError'
      ? Object.values(error.errors).map(err => err.message)
      : error.message || 'Internal server error';
    res.status(error.name === 'ValidationError' ? 400 : 500).json({ success: false, message });
  }
};

// ========== GET ALL STUDENTS ==========
const getAllStudents = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'User identification required.' });

    const students = await Student.find({ createdBy: userId }).populate('createdBy', 'name email').sort({ createdAt: -1 });

     const totalCount = await Student.countDocuments();
    console.log("total Students",totalCount);

    res.status(200).json({
      success: true,
      count: students.length,
       totalCount,
      data: students,
      message: students.length === 0 ? 'No students found for this user' : 'Students retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching students', data: [], count: 0, totalCount:0, });
  }
};

// ========== GET SINGLE STUDENT ==========
const getStudentById = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'User identification required.' });

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID format' });
    }

    const student = await Student.findOne({ _id: req.params.id, createdBy: userId }).populate('createdBy', 'name email');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found or unauthorized access' });

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching student' });
  }
};

// ========== UPDATE STUDENT ==========
const updateStudent = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'User identification required.' });

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID format' });
    }

    const student = await Student.findOne({ _id: req.params.id, createdBy: userId });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found or unauthorized access' });

    // Handle photo update with CloudinaryStorage
    req.body.photoPath = req.file ? req.file.path : student.photoPath;

    delete req.body.createdBy;
    Object.assign(student, req.body);
    await student.save();

    res.status(200).json({ success: true, message: 'Student updated successfully', data: student });
  } catch (error) {
    const message = error.name === 'ValidationError'
      ? Object.values(error.errors).map(err => err.message)
      : error.message || 'Error updating student';
    res.status(400).json({ success: false, message });
  }
};

// ========== DELETE STUDENT ==========
const deleteStudent = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'User identification required.' });

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID format' });
    }

    const student = await Student.findOneAndDelete({ _id: req.params.id, createdBy: userId });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found or unauthorized access' });

    res.status(200).json({ success: true, message: 'Student deleted successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting student' });
  }
};

// ========== BATCH DELETE ==========
const deleteMultipleStudents = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'User identification required.' });

    const { studentIds } = req.body;
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Student IDs array is required' });
    }

    const invalidIds = studentIds.filter(id => !id.match(/^[0-9a-fA-F]{24}$/));
    if (invalidIds.length > 0) {
      return res.status(400).json({ success: false, message: 'Invalid student ID format(s)', invalidIds });
    }

    const result = await Student.deleteMany({ _id: { $in: studentIds }, createdBy: userId });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} student(s)`,
      deletedCount: result.deletedCount,
      requestedCount: studentIds.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting students' });
  }
};

// ========== SEARCH STUDENTS ==========
const searchStudents = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'User identification required.' });

    const { search } = req.query;
    if (!search) return res.status(400).json({ success: false, message: 'Search query is required' });

    const students = await Student.find({
      createdBy: userId,
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { class: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } },
        { motherName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    }).populate('createdBy', 'name email').sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: students.length, data: students, searchQuery: search });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error searching students' });
  }
};

// ========== STUDENT STATISTICS ==========
// ========== STUDENT STATISTICS ==========
const getStudentStats = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User identification required.' });
    }

    const totalStudents = await Student.countDocuments({ createdBy: userId });

    const classStats = await Student.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: '$class', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const printStatusStats = await Student.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: '$printStatus', count: { $sum: 1 } } }
    ]);

    const recentStudents = await Student.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name class createdAt printStatus');

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        classStats,
        printStatusStats, // ✅ added
        recentStudents
      }
    });

  } catch (error) {
    console.error('❌ Error in getStudentStats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching student statistics'
    });
  }
};


// ========== EXPORT ==========
module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  deleteMultipleStudents,
  searchStudents,
  getStudentStats
};