import React from 'react';
import { User, GraduationCap, Calendar, Phone } from 'lucide-react';

const PersonalInfoSection = ({ formData, handleInputChange, errors = {} }) => {
  const baseInputClass =
    "w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 bg-gray-50 hover:bg-white";
  
  return (
    <div className="border-b border-gray-100 pb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <User className="text-blue-600" size={22} />
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student's Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <User size={16} className="text-gray-500" />
            Student's Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter student's full name"
            className={`${baseInputClass} ${
              errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
            }`}
            required
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Class */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <GraduationCap size={16} className="text-gray-500" />
            Class *
          </label>
          <select
            name="class"
            value={formData.class}
            onChange={handleInputChange}
            className={`${baseInputClass} ${
              errors.class ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
            }`}
            required
          >
            <option value="">Select Class</option>
            <option value="1st">1st Grade</option>
            <option value="2nd">2nd Grade</option>
            <option value="3rd">3rd Grade</option>
            <option value="4th">4th Grade</option>
            <option value="5th">5th Grade</option>
            <option value="6th">6th Grade</option>
            <option value="7th">7th Grade</option>
            <option value="8th">8th Grade</option>
            <option value="9th">9th Grade</option>
            <option value="10th">10th Grade</option>
            <option value="11th">11th Grade</option>
            <option value="12th">12th Grade</option>
          </select>
          {errors.class && <p className="text-sm text-red-500">{errors.class}</p>}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            Date of Birth *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={`${baseInputClass} ${
              errors.dateOfBirth ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
            }`}
            required
          />
          {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
        </div>

        {/* Mobile No */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Phone size={16} className="text-gray-500" />
            Mobile No. *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter mobile number"
            className={`${baseInputClass} ${
              errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
            }`}
            required
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
