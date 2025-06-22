const Profile = require('../models/Profile');
const User = require('../models/User');
const Student = require('../models/Student');
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


const getAllUsersProfile = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate('userId', 'name email')
      .lean();

    // Fetch all student counts mapped by userId
    const counts = await Student.aggregate([
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 }
        }
      }
    ]);

    const studentCountMap = {};
    counts.forEach(item => {
      studentCountMap[item._id.toString()] = item.count;
    });

    const formatted = profiles.map((profile) => {
      const uid = profile.userId?._id?.toString();
      return {
        id: uid || null,
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
        studentsCount: studentCountMap[uid] || 0, // 🔥 here is the count
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error('❌ Error getting all users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  getAllUsersProfile,
};