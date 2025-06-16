import React, { useEffect } from 'react';
import { User, Mail, Phone, MapPin, UserCheck, Building, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const PersonalInfoForm = ({ formData, onChange, isCreateMode }) => {
  // Helper function to check if field is empty and required
  const isFieldEmpty = (fieldName) => {
    return isCreateMode && (!formData[fieldName] || formData[fieldName].trim() === '');
  };

  // Check validation and show toast messages
  useEffect(() => {
    if (isCreateMode) {
      const requiredFields = [
        { name: 'name', label: 'Full Name' },
        { name: 'email', label: 'Email Address' },
        { name: 'phone', label: 'Phone Number' },
        { name: 'collegeName', label: 'College/Institution Name' },
        { name: 'address', label: 'Address' }
      ];

      const emptyFields = requiredFields.filter(field => isFieldEmpty(field.name));

      if (emptyFields.length === 1) {
        toast.error(`Please fill in your ${emptyFields[0].label}`);
      } else if (emptyFields.length > 1) {
        toast.error('Please fill in all highlighted required information');
      }
    }
  }, [formData, isCreateMode]);

  // Get input class based on validation state
  const getInputClass = (fieldName, isRequired = false) => {
    const baseClass = "w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200";
    
    if (isRequired && isFieldEmpty(fieldName)) {
      return `${baseClass} border-red-500 focus:ring-red-500`;
    }
    
    return `${baseClass} border-gray-300`;
  };

  // Get textarea class for address field
  const getTextareaClass = (fieldName) => {
    const baseClass = "w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 resize-none";
    return `${baseClass} border-gray-300`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name {isCreateMode && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name || ''}
              onChange={onChange}
              noValidate
              className={getInputClass('name', true)}
            />
            <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          </div>
          {isFieldEmpty('name') && (
            <p className="text-red-500 text-sm mt-1">Full name is required</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address {isCreateMode && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email || ''}
              onChange={onChange}
              noValidate
              className={getInputClass('email', true)}
            />
            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          </div>
          {isFieldEmpty('email') && (
            <p className="text-red-500 text-sm mt-1">Email address is required</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number {isCreateMode && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone || ''}
              onChange={onChange}
              noValidate
              className={getInputClass('phone', true)}
            />
            <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          </div>
          {isFieldEmpty('phone') && (
            <p className="text-red-500 text-sm mt-1">Phone number is required</p>
          )}
        </div>

        {/* College/Institution Name */}
        <div>
          <label htmlFor="collegeName" className="block text-sm font-semibold text-gray-700 mb-2">
            College/Institution Name {isCreateMode && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <input
              type="text"
              id="collegeName"
              name="collegeName"
              placeholder="Enter your college/institution name"
              value={formData.collegeName || ''}
              onChange={onChange}
              noValidate
              className={getInputClass('collegeName', true)}
            />
            <Building className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          </div>
          {isFieldEmpty('collegeName') && (
            <p className="text-red-500 text-sm mt-1">College/Institution name is required</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2">
            Department
          </label>
          <div className="relative">
            <input
              type="text"
              id="department"
              name="department"
              placeholder="Enter your department"
              value={formData.department || ''}
              onChange={onChange}
              noValidate
              className={getInputClass('department')}
            />
            <UserCheck className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Designation */}
        <div>
          <label htmlFor="designation" className="block text-sm font-semibold text-gray-700 mb-2">
            Designation/Position
          </label>
          <div className="relative">
            <input
              type="text"
              id="designation"
              name="designation"
              placeholder="Enter your designation (e.g., Professor, Assistant Professor)"
              value={formData.designation || ''}
              onChange={onChange}
              noValidate
              className={getInputClass('designation')}
            />
            <Briefcase className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          </div>
        </div>
      </div>

      {/* Address Field (Full Width) */}
      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
          Address {isCreateMode && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <textarea
            id="address"
            name="address"
            rows="3"
            placeholder="Enter your full address"
            value={formData.address || ''}
            onChange={onChange}
            noValidate
            className={getInputClass('address', true).replace('pl-12', 'pl-12')}
          />
          <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>

        {isFieldEmpty('address') && (
          <p className="text-red-500 text-sm mt-1">Address is required</p>
        )}
        
      </div>

      {/* Emergency Contact Field (Full Width) */}
      <div>
        <label htmlFor="emergencyContact" className="block text-sm font-semibold text-gray-700 mb-2">
          Emergency Contact
        </label>
        <div className="relative">
          <input
            type="text"
            id="emergencyContact"
            name="emergencyContact"
            placeholder="Enter emergency contact name and number"
            value={formData.emergencyContact || ''}
            onChange={onChange}
            noValidate
            className={getInputClass('emergencyContact')}
          />
          <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
           {isFieldEmpty('emergencyContact') && (
          <p className="text-red-500 text-sm mt-1">Emergency Contact is required</p>
        )}
      </div>

      {isCreateMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <UserCheck size={14} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Profile Setup</h4>
              <p className="text-blue-700 text-sm mt-1">
                Fill in all required fields marked with * to complete your profile setup. 
                This information will help personalize your experience.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoForm;