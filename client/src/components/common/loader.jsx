import React from 'react';
import { CreditCard, Printer } from 'lucide-react';

const SurajPrintingLoader = ({ title = "Processing...", subtitle = "Please wait..." }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      {/* Main Loader Container */}
      <div className="text-center">
        {/* Logo/Icon Section */}
        <div className="mb-6">
          <div className="relative inline-block">
            {/* Rotating Ring */}
            <div className="w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
            {/* Inner Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Main Printer Icon */}
                <Printer size={32} className="text-blue-600 animate-pulse" />
                {/* ID Card Icon - Floating */}
                <CreditCard size={18} className="absolute -top-1 -right-1 text-purple-600 animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Title and Subtitle */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>

        {/* Loading Dots Animation */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-400"></div>
        </div>
      </div>
    </div>
  );
};

export default SurajPrintingLoader;
