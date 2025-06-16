import React from 'react';
import { MapPin } from 'lucide-react';

const AddressInfoSection = ({ formData, handleInputChange, errors = {} }) => {
  const baseInputClass =
    "w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 bg-gray-50 hover:bg-white resize-none";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <MapPin className="text-blue-600" size={22} />
        Address & Additional Information
      </h2>

      {/* Address */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin size={16} className="text-gray-500" />
          Address *
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter complete address"
          rows={3}
          className={`${baseInputClass} ${
            errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
          }`}
          required
        />
        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
      </div>
    </div>
  );
};

export default AddressInfoSection;
