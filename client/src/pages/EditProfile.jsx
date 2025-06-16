import React, { useState, useEffect } from 'react';
import { User, UserPlus, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileHeader from '../components/EditProfile/ProfileHeader';
import TabNavigation from '../components/EditProfile/TabNavigation';
import PersonalInfoForm from '../components/EditProfile/PersonalInfoForm';
import SecurityForm from '../components/EditProfile/SecurityForm';
import SubmitButton from '../components/EditProfile/SubmitButton';
import useProfile from '../hooks/useProfile';
import toast from 'react-hot-toast';
const EditProfile = ({ isCreateMode: propIsCreateMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use the useProfile hook to get real-time profile data
  const { 
    profile, 
    loading: profileLoading, 
    error: profileError, 
    refreshProfile,
    createProfile,
    updateProfile
  } = useProfile();
  
  // Check if this is create mode - from props, pathname, or state
  const isCreateMode = propIsCreateMode || 
                      location.pathname.includes('create-profile') || 
                      location.state?.isNewUser;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    collegeName: '',
    department: '',
    designation: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when profile data is available
  useEffect(() => {
    const initializeFormData = () => {
      if (isCreateMode) {
        // For create mode, get data from location state and merge with profile data
        const signupData = location.state?.userData || {};
        
        // Merge data from signup state and profile hook
        const mergedData = { ...profile, ...signupData };
        
        setFormData(prev => ({
          ...prev,
          name: mergedData.name || '',
          email: mergedData.email || '',
          phone: mergedData.phone || '',
          collegeName: mergedData.collegeName || '',
          department: mergedData.department || '',
          designation: mergedData.designation || '',
          address: mergedData.address || '',
          emergencyContact: mergedData.emergencyContact || ''
        }));
        
        // Set profile image if available
        if (mergedData.profileImage) {
          setProfileImage(mergedData.profileImage);
        }
      } else {
        // For edit mode, use data from useProfile hook
        if (profile) {
          setFormData(prev => ({
            ...prev,
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            collegeName: profile.collegeName || '',
            department: profile.department || '',
            designation: profile.designation || '',
            address: profile.address || '',
            emergencyContact: profile.emergencyContact || ''
          }));
          
          // Set profile image if available
          if (profile.profileImage) {
            setProfileImage(profile.profileImage);
          }
        }
      }
    };

    // Only initialize when profile data is loaded (not loading)
    if (!profileLoading) {
      initializeFormData();
    }
  }, [isCreateMode, location.state, profile, profileLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // ✅ Emergency contact validation
      if (!/^\d{10}$/.test(formData.emergencyContact)) {
        toast.error('Emergency contact must be a valid 10-digit number');
        setIsLoading(false);
        return;
      }
      
      // Prepare data for API call
      const profileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        collegeName: formData.collegeName,
        department: formData.department,
        designation: formData.designation,
        profileImage: profileImage
      };

      // If updating password
      if (formData.newPassword && formData.newPassword.trim() !== '') {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('New passwords do not match!');
          setIsLoading(false);
          return;
        }
        profileData.currentPassword = formData.currentPassword;
        profileData.newPassword = formData.newPassword;
      }

      // Use the appropriate method from useProfile hook
      if (isCreateMode) {
        await createProfile(profileData);
        toast.success('Profile created successfully! Welcome aboard!');
        navigate('/app/dashboard');
      } else {
        await updateProfile(profileData);
        toast.success('Profile updated successfully!');
        navigate('/app/dashboard');
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (isCreateMode) {
      navigate('/signup'); // Go back to signup if in create mode
    } else {
      navigate('/app/dashboard'); // Go back to dashboard if in edit mode
    }
  };

  // Simplified renderActiveForm function - only personal and security tabs
  const renderActiveForm = () => {
    console.log('Current active tab:', activeTab); // Debug log
    
    if (activeTab === 'personal') {
      return (
        <PersonalInfoForm 
          key="personal-form"
          formData={formData} 
          onChange={handleInputChange} 
          isCreateMode={isCreateMode} 
        />
      );
    }
    
    if (activeTab === 'security') {
      return (
        <SecurityForm 
          key="security-form"
          formData={formData} 
          onChange={handleInputChange} 
          isCreateMode={isCreateMode} 
        />
      );
    }
    
    // Default fallback
    return (
      <PersonalInfoForm 
        key="default-form"
        formData={formData} 
        onChange={handleInputChange} 
        isCreateMode={isCreateMode} 
      />
    );
  };

  // Page title and header based on mode
  const pageTitle = isCreateMode ? 'Complete Your Profile' : 'Edit Profile';
  const headerIcon = isCreateMode ? UserPlus : User;
  const HeaderIcon = headerIcon;

  // Debug the activeTab state
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);

  // Show loading state while profile data is being fetched
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-indigo-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error fetching profile data (only for critical errors)
  if (profileError && !profile && !isCreateMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error loading profile: {profileError}</p>
          <button 
            onClick={refreshProfile}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Full screen layout for create mode, normal layout for edit mode
  if (isCreateMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with Back Button (only in create mode) */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-indigo-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <HeaderIcon size={28} className="text-white" />
              </div>
              {pageTitle}
            </h1>
            
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Signup
            </button>
          </div>

          {/* Welcome message for new users */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600 text-white rounded-2xl p-6 mb-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-2">Welcome {formData.name || profile?.name || 'New User'}! </h2>
            <p className="text-indigo-100">
              Complete your profile to get started. Fill in your details to personalize your experience.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <ProfileHeader 
              name={formData.name || profile?.name || 'New User'}
              email={formData.email || profile?.email || 'user@example.com'}
              profileImage={profileImage}
              onImageChange={handleImageChange}
              isCreateMode={isCreateMode}
            />

            <TabNavigation 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isCreateMode={isCreateMode}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div key={activeTab}>
                {renderActiveForm()}
              </div>
              <SubmitButton 
                loading={isLoading}
                isCreateMode={isCreateMode}
              />
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Normal edit mode layout (with existing layout)
  return (
    <div className="h-full w-full p-6 rounded-xl bg-blue-50 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-900 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <HeaderIcon size={28} className="text-white" />
          </div>
          {pageTitle}
        </h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <ProfileHeader 
            name={formData.name || profile?.name || 'User'}
            email={formData.email || profile?.email || 'user@example.com'}
            profileImage={profileImage}
            onImageChange={handleImageChange}
            isCreateMode={isCreateMode}
          />

          <TabNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isCreateMode={isCreateMode}
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div key={activeTab}>
              {renderActiveForm()}
            </div>
            <SubmitButton 
              loading={isLoading}
              isCreateMode={isCreateMode}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;