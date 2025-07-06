// components/auth/InputField.jsx
import React from 'react';

const InputField = ({ 
  label, 
  type = 'text', 
  name, 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  disabled = false,
  icon 
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-200 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="w-full px-4 py-3 pl-12 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {icon && (
          <div className="absolute left-4 top-3.5 text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;