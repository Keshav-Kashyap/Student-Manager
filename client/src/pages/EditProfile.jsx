import React, { useState, useEffect } from 'react';
import { User, UserPlus, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileHeader from '../components/EditProfile/ProfileHeader';
import TabNavigation from '../components/EditProfile/TabNavigation';
import PersonalInfoForm from '../components/EditProfile/PersonalInfoForm';
import SecurityForm from '../components/EditProfile/SecurityForm';
import SubmitButton from '../components/EditProfile/SubmitButton';
import useProfile from '../Hooks/useProfile';
import toast from 'react-hot-toast';
import SurajPrintingLoader from '../components/common/loader'
import { API_BASE } from '../config/api';

const EditProfile = ({ isCreateMode: propIsCreateMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showErrors, setShowErrors] = useState(false);
  const [customFieldErrors, setCustomFieldErrors] = useState({});
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [hasProfile, setHasProfile] = useState(null); // null = unknown, true = has profile, false = no profile
  
  // State for user data from login/navigation
  const [userData, setUserData] = useState(null);
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Use the useProfile hook for profile operations
  const { 
    profile, 
    loading: profileLoading, 
    error: profileError, 
    refreshProfile,
    createProfile,
    updateProfile
  } = useProfile();
  
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

  // ✅ FIRST CHECK USER SESSION ON MOUNT
  useEffect(() => {
    checkUserSession();
  }, []);

  // ✅ CHECK USER SESSION (COOKIE-BASED)
  const checkUserSession = async () => {
    console.log('🍪 Checking user session...');
    setIsVerifyingSession(true);

    try {
      const response = await fetch(`${API_BASE}/api/users/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Session verified:', result);
        
        // Handle both possible response structures
        let user = null;
        if (result.success && result.user) {
          user = result.user;
        } else if (result.success && result.data) {
          user = result.data;
        } else if (result.data && !result.success) {
          user = result.data;
        }
        
        if (user) {
          setUserData(user);
          // Check if user has profile - check multiple possible ways
          const hasUserProfile = user.hasProfile;

          setHasProfile(hasUserProfile);
          console.log('👤 User data:', user);
          console.log('👤 User has profile:', hasUserProfile);
        } else {
          console.log('❌ No valid session found - no user data');
          navigate('/login');
        }
      } else {
        console.log('❌ Session verification failed:', response.status);
        navigate('/login');
      }
    } catch (error) {
      console.error('❌ Session check error:', error);
      navigate('/login');
    } finally {
      setIsVerifyingSession(false);
      setSessionChecked(true);
    }
  };

  // ✅ DETERMINE CREATE MODE BASED ON PATH AND PROFILE STATUS
  useEffect(() => {
    if (!sessionChecked || !userData) return;

    const path = location.pathname;
    const isCreatePath = path.includes('/create-profile');
    
    // Check if user has profile based on multiple indicators
    let userHasProfile = false;
    
    if (hasProfile !== null) {
      userHasProfile = hasProfile;
    } else if (profile && Object.keys(profile).length > 0) {
      userHasProfile = true;
    } else if (userData.hasProfile !== undefined) {
      userHasProfile = userData.hasProfile;
    }
    
    console.log('🔍 Profile check:', {
      hasProfile,
      profileExists: profile && Object.keys(profile).length > 0,
      userHasProfile,
      isCreatePath
    });
    
    // If user explicitly navigated to crea te-profile, respect that
    if (isCreatePath) {
      setIsCreateMode(true);
      console.log('✅ Create mode - explicit path');
    } 
    // If user has no profile, force create mode
    else if (!userHasProfile) {
      setIsCreateMode(true);
      console.log('✅ Create mode - no profile found');
    } 
    // If user has profile and on edit path, use edit mode
    else {
      setIsCreateMode(false);
      console.log('✅ Edit mode - profile exists');
    }
    
    // Update hasProfile state if it was null
    if (hasProfile === null) {
      setHasProfile(userHasProfile);
    }
  }, [sessionChecked, userData, hasProfile, profile, location.pathname]);

  // ✅ LOAD PROFILE DATA WHEN NOT IN CREATE MODE
  useEffect(() => {
    if (!sessionChecked || !userData) return;
    
    // Only load profile if in edit mode and don't have profile data yet
    if (!isCreateMode && !profile && !profileLoading) {
      console.log("🔄 Loading profile for edit mode...");
      refreshProfile();
    }
  }, [sessionChecked, userData, isCreateMode, profile, profileLoading, refreshProfile]);

  // ✅ FORM DATA INITIALIZATION
  useEffect(() => {
    if (!sessionChecked) return;

    const initializeFormData = () => {
      console.log('📝 Initializing form data...');
      
      if (isCreateMode && userData) {
        console.log("📝 Using user data for create mode:", userData);
        setFormData(prev => ({
          ...prev,
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          collegeName: userData.collegeName || '',
          department: userData.department || '',
          designation: userData.designation || '',
          address: userData.address || '',
          emergencyContact: userData.emergencyContact || ''
        }));
        
        if (userData.profileImage) {
          setProfileImage(userData.profileImage);
        }
      } else if (!isCreateMode && profile) {
        // Edit mode - use profile data
        console.log("📝 Using profile data for edit mode:", profile);
        setFormData(prev => ({
          ...prev,
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          collegeName: profile.collegeName || '',
          department: profile.department || '',
          designation: profile.designation || '',
          address: profile.address || '',
          emergencyContact: profile.emergencyContact || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        if (profile.profileImage) {
          setProfileImage(profile.profileImage);
        }
      }
    };

    // Initialize when not loading
    if (!isVerifyingSession && !profileLoading) {
      initializeFormData();
    }
  }, [
    sessionChecked,
    userData,
    profile, 
    profileLoading, 
    isCreateMode,
    isVerifyingSession
  ]);

  // Debug logging
  useEffect(() => {
    console.log("🔍 Debug Info:");
    console.log("- sessionChecked:", sessionChecked);
    console.log("- hasProfile:", hasProfile);
    console.log("- isCreateMode:", isCreateMode);
    console.log("- userData:", userData);
    console.log("- profile:", profile);
    console.log("- profileLoading:", profileLoading);
    console.log("- location.pathname:", location.pathname);
  }, [sessionChecked, hasProfile, isCreateMode, userData, profile, profileLoading, location.pathname]);

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
    setShowErrors(true);
    setCustomFieldErrors({});

    const requiredFields = ['name', 'email', 'phone', 'collegeName', 'address'];
    const emptyFields = requiredFields.filter(field => !formData[field]?.trim());

    if (emptyFields.length > 0) {
      toast.error('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Field validation
    const newErrors = {};
    if (formData.emergencyContact && !/^\d{10}$/.test(formData.emergencyContact)) {
      newErrors.emergencyContact = 'Emergency contact must be a valid 10-digit number';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be a valid 10-digit number';
    }

    if (Object.keys(newErrors).length > 0) {
      setCustomFieldErrors(newErrors);
      toast.error('Please fix the highlighted errors');
      setIsLoading(false);
      return;
    }

    try {
      // Build profile data
      const profileData = {
        ...formData,
        profileImage
      };

      // Password validation
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('New passwords do not match!');
          setIsLoading(false);
          return;
        }
        
        if (!isCreateMode && !formData.currentPassword) {
          toast.error('Current password is required to change password');
          setIsLoading(false);
          return;
        }
      }

      if (isCreateMode) {
        console.log("🚀 Creating profile with data:", profileData);
        const result = await createProfile(profileData);
        toast.success('Profile created successfully! Welcome aboard!');
        
        // Update user session to reflect profile creation
        setHasProfile(true);
        
        // Refresh profile data
        await refreshProfile();
        
        // Reset password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        // Navigate to dashboard
        navigate('/app/dashboard');
      } else {
        console.log("🔄 Updating profile with data:", profileData);
        const result = await updateProfile(profileData);
        toast.success('Profile updated successfully!');
        
        // Refresh profile data
        await refreshProfile();
        
        // Reset password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        // Navigate to dashboard
        navigate('/app/dashboard');
      }
    } catch (error) {
      console.error("❌ Profile save error:", error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (isCreateMode) {
      navigate('/login');
    } else {
      navigate('/app/dashboard');
    }
  };

  const renderActiveForm = () => {
    if (activeTab === 'personal') {
      return (
        <PersonalInfoForm 
          key="personal-form"
          formData={formData} 
          onChange={handleInputChange} 
          isCreateMode={isCreateMode} 
          showErrors={showErrors}
          fieldErrors={customFieldErrors}
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
         userEmail={formData.email || userData?.email} 
        />
      );
    }
    
    return (
      <PersonalInfoForm 
        key="default-form"
        formData={formData} 
        onChange={handleInputChange} 
        isCreateMode={isCreateMode} 
        showErrors={showErrors}
        fieldErrors={customFieldErrors}
      />
    );
  };

  const pageTitle = isCreateMode ? 'Complete Your Profile' : 'Edit Profile';
  const headerIcon = isCreateMode ? UserPlus : User;
  const HeaderIcon = headerIcon;

  // ✅ LOADING STATES
  if (isVerifyingSession || !sessionChecked) {
    return (
      <SurajPrintingLoader 
        title="Verifying Your Session..." 
        subtitle="Please wait while we verify your login..." 
      />
    );
  }

  if (!isCreateMode && profileLoading) {
    return (
      <SurajPrintingLoader 
        title="Loading Profile..." 
        subtitle="Setting up your account..." 
      />
    );
  }

  // ✅ ERROR STATES
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

  // ✅ ACCESS VALIDATION
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 font-medium mb-6">
            Please login first to access your profile.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Get display data
  const displayName = formData.name || userData?.name || '';
  const displayEmail = formData.email || userData?.email || '';

  // ✅ MAIN RENDER
  const renderMainContent = () => (
    <div className="bg-white  mb-[50px] rounded-2xl shadow-xl p-8 ">
      <ProfileHeader 
        name={displayName}
        email={displayEmail}
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
  );

  // Full screen layout for create mode
  if (isCreateMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
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
              Back to Login
            </button>
          </div>

          {/* Welcome message */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600 text-white rounded-2xl p-6 mb-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-2">Welcome {displayName}! 🎉</h2>
            <p className="text-indigo-100">
              Complete your profile to get started. Fill in your details to personalize your experience.
            </p>
          </div>

          {renderMainContent()}
        </div>
      </div>
    );
  }

  // Normal edit mode layout
  return (
    <div className="h-full w-full p-6 rounded-xl bg-blue-50 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-900 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <HeaderIcon size={28} className="text-white" />
          </div>
          {pageTitle}
        </h1>
      </div>

      <div className="max-w-4xl mx-auto">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default EditProfile;