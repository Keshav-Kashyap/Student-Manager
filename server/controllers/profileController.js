const Profile = require('../models/Profile');
const User = require('../models/User');
const Student = require('../models/Student'); // Add this import

// Create Profile
const createProfile = async (req, res) => {
  const { 
    name, 
    email, 
    collegeName, 
    department, 
    designation, 
    address, 
    emergencyContact, 
    phone, 
    profileImage 
  } = req.body;

  try {
    console.log("📥 Incoming Profile Data:", req.body);
    console.log("🔐 Authenticated User:", req.user);

    // Check if profile already exists for user
    const existing = await Profile.findOne({ userId: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    // Update User model with name and email if provided
    if (name || email) {
      await User.findByIdAndUpdate(req.user.id, {
        ...(name && { name }),
        ...(email && { email })
      });
    }

    // Create new profile
    const profile = await Profile.create({
      userId: req.user.id,
      collegeName,
      department,
      designation,
      address,
      emergencyContact,
      phone,
      profileImage
    });

    // Return complete profile with user data
    const completeProfile = await Profile.findById(profile._id)
      .populate('userId', 'name email');

    const responseData = {
      name: completeProfile.userId.name,
      email: completeProfile.userId.email,
      collegeName: completeProfile.collegeName,
      department: completeProfile.department,
      designation: completeProfile.designation,
      address: completeProfile.address,
      emergencyContact: completeProfile.emergencyContact,
      phone: completeProfile.phone,
      profileImage: completeProfile.profileImage || null,
      id: completeProfile.userId._id,
      profileId: completeProfile._id
    };

    res.status(201).json({ 
      message: 'Profile created successfully', 
      profile: responseData 
    });
  } catch (err) {
    console.error("❌ Error creating profile:", err);
    res.status(500).json({ message: 'Error creating profile', error: err.message });
  }
};

// Get Profile (with user name & email)
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id })
      .populate('userId', 'name email');

    if (!profile) {
      // If no profile exists, return basic user data
      const user = await User.findById(req.user.id).select('name email');
      return res.status(200).json({
        name: user.name,
        email: user.email,
        collegeName: '',
        department: '',
        designation: '',
        address: '',
        emergencyContact: '',
        phone: '',
        profileImage: null,
        id: user._id,
        profileId: null,
        isProfileComplete: false
      });
    }

    const mergedProfile = {
      name: profile.userId.name,
      email: profile.userId.email,
      collegeName: profile.collegeName,
      department: profile.department,
      designation: profile.designation,
      address: profile.address,
      emergencyContact: profile.emergencyContact,
      phone: profile.phone,
      profileImage: profile.profileImage || null,
      id: profile.userId._id,
      profileId: profile._id,
      isProfileComplete: true
    };

    res.status(200).json(mergedProfile);
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  const { 
    name, 
    email, 
    collegeName, 
    department, 
    designation, 
    address, 
    emergencyContact, 
    phone, 
    profileImage 
  } = req.body;

  try {
    // Update User model with name and email if provided
    if (name || email) {
      await User.findByIdAndUpdate(req.user.id, {
        ...(name && { name }),
        ...(email && { email })
      });
    }

    // Find or create profile
    let profile = await Profile.findOne({ userId: req.user.id });
    
    if (!profile) {
      // Create new profile if doesn't exist
      profile = await Profile.create({
        userId: req.user.id,
        collegeName,
        department,
        designation,
        address,
        emergencyContact,
        phone,
        profileImage
      });
    } else {
      // Update existing profile
      profile.collegeName = collegeName;
      profile.department = department;
      profile.designation = designation;
      profile.address = address;
      profile.emergencyContact = emergencyContact;
      profile.phone = phone;
      profile.profileImage = profileImage;
      
      await profile.save();
    }

    // Return complete updated profile
    const updatedProfile = await Profile.findById(profile._id)
      .populate('userId', 'name email');

    const responseData = {
      name: updatedProfile.userId.name,
      email: updatedProfile.userId.email,
      collegeName: updatedProfile.collegeName,
      department: updatedProfile.department,
      designation: updatedProfile.designation,
      address: updatedProfile.address,
      emergencyContact: updatedProfile.emergencyContact,
      phone: updatedProfile.phone,
      profileImage: updatedProfile.profileImage || null,
      id: updatedProfile.userId._id,
      profileId: updatedProfile._id,
      isProfileComplete: true
    };

    res.status(200).json({ 
      message: 'Profile updated successfully', 
      profile: responseData 
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};

// Get All Users with Student Count and Student Information
const getAllUsersProfile = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate('userId', 'name email')
      .lean();

    // Get student data for all users
    const userIds = profiles.map(profile => profile.userId?._id).filter(Boolean);
    
    // Get student counts for each user
    const studentCounts = await Student.aggregate([
      { $match: { createdBy: { $in: userIds } } },
      { $group: { _id: '$createdBy', count: { $sum: 1 } } }
    ]);

    // Get recent students for each user (optional - you can modify this based on your needs)
    const recentStudents = await Student.find({ createdBy: { $in: userIds } })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(100) // Adjust limit as needed
      .lean();

    // Create a map for quick lookup
    const studentCountMap = {};
    studentCounts.forEach(item => {
      studentCountMap[item._id.toString()] = item.count;
    });

    // Group students by user
    const studentsByUser = {};
    recentStudents.forEach(student => {
      const userId = student.createdBy._id.toString();
      if (!studentsByUser[userId]) {
        studentsByUser[userId] = [];
      }
      studentsByUser[userId].push({
        id: student._id,
        name: student.name,
        class: student.class,
        phone: student.phone,
        photoPath: student.photoPath,
        createdAt: student.createdAt
      });
    });

    // Format response with student data
    const formatted = profiles.map((profile) => {
      const userId = profile.userId?._id?.toString();
      return {
        id: profile.userId?._id || null,
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
        // Student information
        studentCount: studentCountMap[userId] || 0,
        students: studentsByUser[userId] || [],
        hasStudents: (studentCountMap[userId] || 0) > 0
      };
    });

    // Add summary statistics
    const totalUsers = formatted.length;
    const totalStudents = Object.values(studentCountMap).reduce((sum, count) => sum + count, 0);
    const usersWithStudents = formatted.filter(user => user.hasStudents).length;

    res.status(200).json({
      users: formatted,
      summary: {
        totalUsers,
        totalStudents,
        usersWithStudents,
        usersWithoutStudents: totalUsers - usersWithStudents
      },
      success: true,
      message: 'Users with student data retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error getting all users with students:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      success: false 
    });
  }
};

// Get Single User's Students (Additional endpoint)
const getUserStudents = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    // Get user profile
    const profile = await Profile.findOne({ userId })
      .populate('userId', 'name email');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    // Get user's students
    const students = await Student.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .lean();

    // Get student statistics
    const totalStudents = students.length;
    const classStats = await Student.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: '$class', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      user: {
        id: profile.userId._id,
        name: profile.userId.name,
        email: profile.userId.email,
        collegeName: profile.collegeName,
        department: profile.department,
        designation: profile.designation
      },
      students: students,
      statistics: {
        totalStudents,
        classStats
      },
      message: 'User students retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error getting user students:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user students',
      error: error.message 
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  getAllUsersProfile,
  getUserStudents, // New endpoint
};