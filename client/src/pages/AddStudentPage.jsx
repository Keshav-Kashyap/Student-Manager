import React, { useState } from 'react';
import { getHeaders } from '../services/studentService';
import toast from 'react-hot-toast';
import { API_BASE } from '../config/api';
import {
  HeaderSection,
  PhotoUploadSection,
  PersonalInfoSection,
  ParentsInfoSection,
  AddressInfoSection,
  ActionButtons,
} from '../components/AddStudent';

const AddStudentPage = () => {
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


  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

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
    setPhotoPreview(null);
    // Reset file input
    const fileInput = document.getElementById('photo-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = {};

    const submitData = new FormData();


  
// Name
if (!formData.name.trim()) {
  newErrors.name = 'Name is required';
} else if (formData.name.trim().length < 3) {
  newErrors.name = 'Name must be at least 3 characters';
} else if (formData.name.trim().length > 50) {
  newErrors.name = 'Name must be at most 50 characters';
}

// Father's name
if (!formData.fatherName.trim()) {
  newErrors.fatherName = "Father's name is required";
} else if (formData.fatherName.trim().length < 3) {
  newErrors.fatherName = "Father's name must be at least 3 characters";
} else if (formData.fatherName.trim().length > 50) {
  newErrors.fatherName = "Father's name must be at most 50 characters";
}

// Mother's name
if (!formData.motherName.trim()) {
  newErrors.motherName = "Mother's name is required";
}
else if(formData.motherName.trim().length < 3) {
    newErrors.motherName = "Mother's name must be at least 3 characters";
  } else if (formData.motherName.trim().length > 50) {
    newErrors.motherName = "Mother's name must be at most 50 characters";
  }


// Phone number
if (!formData.phone.trim()) {
  newErrors.phone = 'Phone number is required';
} else if (!/^\d{10}$/.test(formData.phone.trim())) {
  newErrors.phone = 'Phone number must be exactly 10 digits';
}

// Class
if (!formData.class.trim()) {
  newErrors.class = 'Class is required';
} else if (formData.class.trim().length > 20) {
  newErrors.class = 'Class must be at most 20 characters';
}

// Address
if (!formData.address.trim()) {
  newErrors.address = 'Address is required';
} else if (formData.address.trim().length < 3) {
  newErrors.address = 'Address must be at least 3 characters';
} else if (formData.address.trim().length > 200) {
  newErrors.address = 'Address must be at most 200 characters';
}

// DOB
if (!formData.dateOfBirth.trim()) {
  newErrors.dateOfBirth = 'Date of Birth is required';
}

    if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    toast.error('Please fix the highlighted errors');
    setLoading(false);
    return;
  }

    setErrors({}); // ✅ Clear previous errors if all good

    // Add all form fields to FormData - matching backend controller field names
    submitData.append('name', formData.name);
    submitData.append('class', formData.class);
    submitData.append('phone', formData.phone);
    submitData.append('address', formData.address);
    submitData.append('fatherName', formData.fatherName);
    submitData.append('motherName', formData.motherName);
    submitData.append('dateOfBirth', formData.dateOfBirth);
    submitData.append('other', formData.other);

    // Add photo if exists
    if (formData.photo) {
      submitData.append('photo', formData.photo);
    }

    try {
    const response = await fetch(`${API_BASE}/api/students`, {

        method: "POST",
       credentials: 'include',
        body: submitData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("✅ Student saved successfully!");
        handleClear();
      } else {
        toast.error(result.message || "❌ Failed to save student.");
        console.error('Server error:', result);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("❌ Something went wrong while submitting the form.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleClear = () => {
    setFormData({
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
    setPhotoPreview(null);
    // Reset file input
    const fileInput = document.getElementById('photo-upload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <HeaderSection />

        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
          <div className="space-y-6">
            <PhotoUploadSection
              formData={formData}
              photoPreview={photoPreview}
              handlePhotoChange={handlePhotoChange}
              removePhoto={removePhoto}
              errors={errors}
            />

            <PersonalInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
            />

            <ParentsInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
            />

            <AddressInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
            />

            <ActionButtons
              handleSubmit={handleSubmit}
              handleClear={handleClear}
              loading={loading}
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

export default AddStudentPage;