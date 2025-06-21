// controllers/adminController.js
const User = require('../models/User');
const Student = require('../models/Student');

exports.getAllUsersWithStudentData = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    const response = await Promise.all(users.map(async (user) => {
      const students = await Student.find({ userId: user._id });

      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        total: students.length,
        pending: students.filter(s => s.status === 'pending').length,
        printed: students.filter(s => s.status === 'printed').length,
        students
      };
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
