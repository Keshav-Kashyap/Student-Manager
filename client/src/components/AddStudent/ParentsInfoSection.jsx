import React from 'react';
import { Users, User } from 'lucide-react';

const ParentsInfoSection = ({ formData, handleInputChange, errors = {} }) => {
  const baseInputClass =
    "w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 bg-gray-50 hover:bg-white";

  return (
    <div className="border-b border-gray-100 pb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Users className="text-blue-600" size={22} />
        Parents Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Father's Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <User size={16} className="text-gray-500" />
            Father's Name *
          </label>
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleInputChange}
            placeholder="Enter father's name"
            className={`${baseInputClass} ${
              errors.fatherName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
            }`}
            required
          />
          {errors.fatherName && <p className="text-sm text-red-500">{errors.fatherName}</p>}
        </div>

        {/* Mother's Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <User size={16} className="text-gray-500" />
            Mother's Name
          </label>
          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleInputChange}
            placeholder="Enter mother's name"
            className={`${baseInputClass} ${
              errors.motherName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
            }`}
          />
          {errors.motherName && <p className="text-sm text-red-500">{errors.motherName}</p>}
        </div>
      </div>
    </div>
  );
};

export default ParentsInfoSection;
