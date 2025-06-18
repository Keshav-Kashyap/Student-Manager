const API_BASE = import.meta.env.DEV 
  ? "http://localhost:5000" 
  : "https://student-manager-qpdt.onrender.com";

// Validation function for student form data
export const validateFormData = (formData) => {
  const errors = {};
  
  // Name validation  
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Student name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }
  
  // Class validation
  if (!formData.class || formData.class.trim() === '') {
    errors.class = 'Class selection is required';
  }
  
  // Date of Birth validation
  if (!formData.dateOfBirth || formData.dateOfBirth.trim() === '') {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const selectedDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();
    
    if (selectedDate > today) {
      errors.dateOfBirth = 'Date of birth cannot be in the future';
    } else if (age > 25) {
      errors.dateOfBirth = 'Please enter a valid date of birth';
    } else if (age < 3) {
      errors.dateOfBirth = 'Student must be at least 3 years old';
    }
  }
  
  // Phone validation
  if (!formData.phone || formData.phone.trim() === '') {
    errors.phone = 'Mobile number is required';
  } else {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }
  }
  
  // Father's name validation
  if (!formData.fatherName || formData.fatherName.trim() === '') {
    errors.fatherName = "Father's name is required";
  } else if (formData.fatherName.trim().length < 2) {
    errors.fatherName = "Father's name must be at least 2 characters long";
  }
  
  // Mother's name validation
  if (!formData.motherName || formData.motherName.trim() === '') {
    errors.motherName = "Mother's name is required";
  } else if (formData.motherName.trim().length < 2) {
    errors.motherName = "Mother's name must be at least 2 characters long";
  }
  
  // Address validation
  if (!formData.address || formData.address.trim() === '') {
    errors.address = 'Address is required';
  } else if (formData.address.trim().length < 10) {
    errors.address = 'Please enter a complete address (minimum 10 characters)';
  }
  
  // Photo validation (optional but if provided, check file type)
  if (formData.photo) {
    if (!formData.photo.type.startsWith('image/')) {
      errors.photo = 'Please select a valid image file';
    } else if (formData.photo.size > 5 * 1024 * 1024) {
      errors.photo = 'Photo size should be less than 5MB';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Submit student data function
export const submitStudentData = async (formData) => {
  // First validate the form data
  const validation = validateFormData(formData);
  
  if (!validation.isValid) {
    return { 
      success: false, 
      error: 'Please correct the validation errors',
      validationErrors: validation.errors 
    };
  }
  
  const submitData = new FormData();
  
  // Add all form fields to FormData
  Object.keys(formData).forEach(key => {
    if (key === 'photo' && formData[key]) {
      submitData.append('photo', formData[key]);
    } else if (key !== 'photo') {
      submitData.append(key, formData[key]);
    }
  });

  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      body: submitData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to save student');
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Helper function to format validation errors for display
export const formatValidationErrors = (errors) => {
  return Object.values(errors).join('\n');
};