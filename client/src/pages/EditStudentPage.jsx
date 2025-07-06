import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config/api';
import toast from 'react-hot-toast';
import {
  HeaderSection,
  PhotoUploadSection,
  PersonalInfoSection,
  ParentsInfoSection,
  AddressInfoSection,
  ActionButtons,
} from '../components/AddStudent';

const EditStudentPage = () => {
  const { id } = useParams(); // Get student ID from URL
  console.log(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    class: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    other: '',
    photo: null
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState(null);

  // Fetch student data when component mounts
  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      console.log(id);
      const response = await fetch(
        `${API_BASE}/api/students/${id}`,
        {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const result2 = await response.json();
      const result = result2.data;

      console.log("🧪 API Result:", result);

      if (response.ok) {
        setFormData({
          name: result.name || '',
          fatherName: result.fatherName || '',
          motherName: result.motherName || '',
          class: result.class || '',
          dateOfBirth: result.dateOfBirth ? result.dateOfBirth.split('T')[0] : '',
          phone: result.phone || '',
          address: result.address || '',
          other: result.other || '',
          photo: result.photoPath,
        });

        if (result.photoPath) {
          const imageUrl = result.photoPath.startsWith('http')
            ? result.photoPath
            : `${API_BASE}/${result.photoPath}`;

          setExistingPhotoUrl(imageUrl);
          setPhotoPreview(imageUrl);
        }
      } else {
        toast.error(result2.message || 'Failed to load student data');
        navigate('/app/students');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Error loading student data');
      navigate('/app/students');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        photo: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null
    }));
    setPhotoPreview(existingPhotoUrl); // Reset to existing photo if available
    // Reset file input
    const fileInput = document.getElementById('photo-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    
    // Add all form fields to FormData
    submitData.append('name', formData.name);
    submitData.append('class', formData.class);
    submitData.append('phone', formData.phone);
    submitData.append('address', formData.address);
    submitData.append('fatherName', formData.fatherName);
    submitData.append('motherName', formData.motherName);
    submitData.append('dateOfBirth', formData.dateOfBirth);
    submitData.append('other', formData.other);
    
    // Add photo only if a new photo is selected
    if (formData.photo) {
      submitData.append('photo', formData.photo);
    }

    try {
      const response = await fetch(`${API_BASE}/api/students/${id}`, {
        method: "PUT",
        credentials: 'include', // Include cookies for authentication
        // Note: Don't set Content-Type header for FormData - browser sets it automatically
        body: submitData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("✅ Student updated successfully!");
        navigate('/app/students'); // Redirect to students list
      } else {
        toast.error(result.message || "❌ Failed to update student.");
        console.error('Server error:', result);
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("❌ Something went wrong while updating the student.");
    }
  };

  const handleClear = () => {
    // Reset to original fetched data
    fetchStudentData();
  };

  const handleCancel = () => {
    navigate('/app/students'); // Go back to students list
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading student data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <HeaderSection title="Edit Student" subtitle="Update student information" />
        
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
          <div className="space-y-6">
            <PhotoUploadSection 
              formData={formData} 
              photoPreview={photoPreview}
              handlePhotoChange={handlePhotoChange} 
              removePhoto={removePhoto}
            />
            
            <PersonalInfoSection 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
            
            <ParentsInfoSection 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
            
            <AddressInfoSection 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
            
            <ActionButtons 
              handleSubmit={handleSubmit} 
              handleClear={handleClear}
              handleCancel={handleCancel}
              isEditMode={true}
            />
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Fields marked with <span className="text-red-500">*</span> are required
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditStudentPage;