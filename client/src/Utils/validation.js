export const validatePhotoFile = (file) => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, message: 'Please select a valid image file' };
  }
  
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, message: 'Photo size should be less than 5MB' };
  }
  
  return { isValid: true, message: '' };
};

export const validateFormData = (formData) => {
  const requiredFields = ['name', 'class', 'dateOfBirth', 'phone', 'fatherName', 'motherName', 'address'];
  
  for (let field of requiredFields) {
    if (!formData[field] || formData[field].toString().trim() === '') {
      return { isValid: false, message: `${field} is required` };
    }
  }
  
  return { isValid: true, message: '' };
};
