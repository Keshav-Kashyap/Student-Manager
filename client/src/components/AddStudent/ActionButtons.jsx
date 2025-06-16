import React from 'react';
import { Save, X, LoaderCircle } from 'lucide-react';

const ActionButtons = ({ handleSubmit, handleClear, handleCancel, isEditMode = false, loading = false }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className={`flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl 
          font-medium flex items-center justify-center gap-2 shadow-lg transition-all duration-200
          ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl'}
        `}
      >
        {loading ? (
          <LoaderCircle size={20} className="animate-spin" />
        ) : (
          <Save size={20} />
        )}
        {loading ? 'Saving...' : isEditMode ? 'Update Student' : 'Save Student'}
      </button>

      <button
        type="button"
        onClick={handleClear}
        disabled={loading}
        className={`flex-1 sm:flex-initial bg-gray-100 text-gray-700 px-8 py-4 rounded-xl 
          border border-gray-200 font-medium flex items-center justify-center gap-2 
          transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}
        `}
      >
        <X size={20} />
        {isEditMode ? 'Reset' : 'Clear Form'}
      </button>

      {isEditMode && (
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className={`flex-1 sm:flex-initial bg-red-100 text-red-700 px-8 py-4 rounded-xl 
            border border-red-200 font-medium flex items-center justify-center gap-2 
            transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-200'}
          `}
        >
          <X size={20} />
          Cancel
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
