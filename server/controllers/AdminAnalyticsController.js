// controllers/AdminAnalyticsController.js
const Profile = require('../models/Profile');
const Student = require('../models/Student');

const getAllUsersProfileAnalytics = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate('userId', 'name email createdAt role phone')
      .lean();

    const formatted = await Promise.all(
      profiles.map(async (profile) => {
        const userId = profile.userId?._id;

        const studentsCount = userId
          ? await Student.countDocuments({ createdBy: userId })
          : 0;

        const studentsData = userId
          ? await Student.find({ createdBy: userId }).select('name class dateOfBirth photoPath fatherName phone createdAt')
          : [];

        return {
          id: userId || null,    
          name: profile.userId?.name || 'Unknown',
          email: profile.userId?.email || 'Unknown',
          collegeName: profile.collegeName || '',
          department: profile.department || '',
          designation: profile.designation || '',
          address: profile.address || '',
          emergencyContact: profile.emergencyContact || '',
          phone: profile.phone || '',
          profileImage: profile.profileImage || null,
          profileId: profile._id,
          studentsCount,
          students: studentsData,
          joinDate: profile.userId?.createdAt
            ? new Date(profile.userId.createdAt).toLocaleDateString('en-IN')
            : 'Unknown',
        };
      })
    );

    const totalStudents = formatted.reduce((sum, user) => sum + user.studentsCount, 0);

    res.json({
      users: formatted,
      totalStudents,
    });
  } catch (error) {
    console.error('❌ Error in Admin Analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllUsersProfileAnalytics };
