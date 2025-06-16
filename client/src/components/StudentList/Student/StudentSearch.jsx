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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
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
        <div className="flex items-center gap-3">
          <button 
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-3 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <Filter size={18} />
            Refresh
          </button>
          <button 
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-3 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <Download size={18} />
            Export
          </button>
          {selectedCount > 0 && (
            <button 
              onClick={onDeleteSelected}
              className="flex items-center gap-2 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors duration-200"
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