import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useFormData = (profile, profileLoading, isCreateMode) => {
  const location = useLocation();
  
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

  const [profileImage, setProfileImage] = useState(
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  );

  // Initialize form data when profile data is available
  useEffect(() => {
    const initializeFormData = () => {
      if (isCreateMode) {
        const signupData = location.state?.userData || {};
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
        
        if (mergedData.profileImage) {
          setProfileImage(mergedData.profileImage);
        }
      } else {
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
          
          if (profile.profileImage) {
            setProfileImage(profile.profileImage);
          }
        }
      }
    };

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

  return {
    formData,
    profileImage,
    handleInputChange,
    handleImageChange,
    setFormData
  };
};