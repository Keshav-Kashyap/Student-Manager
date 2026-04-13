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
      <label htmlFor={name} className="block text-sm font-medium text-[#3f3f46] mb-1.5">
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
          className="w-full px-4 py-2.5 pl-11 bg-[#fcfcfb] border border-[#e4e4e7] rounded-xl text-[#171717] placeholder-[#a1a1aa] focus:ring-2 focus:ring-[#93c5fd] focus:border-[#93c5fd] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        />
        {icon && (
          <div className="absolute left-3.5 top-3 text-[#9ca3af]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;