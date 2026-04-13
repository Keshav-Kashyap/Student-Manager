import React from 'react';
import { Search, Filter, Download, Trash2 } from 'lucide-react';

const StudentSearch = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  onExport,
  selectedCount,
  onDeleteSelected
}) => {
  return (
    <div className="bg-white shadow-sm border border-gray-100 p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
          <button
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-100"
          >
            <Filter size={18} />
            Refresh
          </button>



          {selectedCount > 0 && (
            <button
              onClick={onDeleteSelected}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-red-600 transition-colors duration-200 hover:bg-red-100"
            >
              <Trash2 size={18} />
              Delete ({selectedCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSearch;