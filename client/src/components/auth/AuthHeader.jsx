import React from 'react';

const AuthHeader = ({ title, subtitle, icon }) => {
  return (
    <div className="text-center mb-8">
      <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
        {icon}
      </div>
      <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="text-gray-300 text-lg">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;