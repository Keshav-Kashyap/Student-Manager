import React from 'react';
import { Plus } from 'lucide-react';

const Header = ({
  onAddNewStudent,
  title = "Student Management",
  subtitle = "Manage and view all student records",
  buttonLabel = "Add New Student",
}) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
            <p className="text-gray-600 mt-1">{subtitle}</p>
          </div>
          <button
            onClick={onAddNewStudent}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl sm:w-auto"
          >
            <Plus size={20} />
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;