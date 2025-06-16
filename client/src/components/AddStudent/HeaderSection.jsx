import React from 'react';
import { GraduationCap } from 'lucide-react';

const HeaderSection = ({ title = "Add New Student", subtitle = "Enter student information to create a new record" }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 mb-8 p-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
          <GraduationCap className="text-white" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;