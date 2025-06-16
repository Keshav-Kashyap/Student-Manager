import React from 'react';

const ContactOption = ({ option }) => {
  const { icon: Icon, title, description, action, onClick } = option;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-blue-50 hover:bg-blue-100 transition p-4 rounded-lg shadow-md flex flex-col items-center text-center"
    >
      <div className="bg-indigo-500 text-white p-3 rounded-full mb-3">
        <Icon size={24} />
      </div>
      <h3 className="font-semibold text-lg text-indigo-900">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <span className="text-blue-600 font-medium">{action}</span>
    </div>
  );
};

export default ContactOption;
