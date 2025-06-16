import React from 'react';

const FormInput = ({ 
  label, 
  icon: Icon, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  className = '',
  rows 
}) => {
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        {Icon && <Icon size={16} />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <InputComponent
        type={type !== 'textarea' ? type : undefined}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white resize-none"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default FormInput;
