import React from 'react';
import { Plus } from 'lucide-react';

const Header = ({ onAddNewStudent }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600 mt-1">Manage and view all student records</p>
          </div>
          <button 
            onClick={onAddNewStudent}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus size={20} />
            Add New Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;