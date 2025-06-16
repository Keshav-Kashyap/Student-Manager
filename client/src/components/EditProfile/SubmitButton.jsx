import React from 'react';
import { Save, Loader2, UserCheck } from 'lucide-react';

const SubmitButton = ({ loading = false, disabled = false, isCreateMode = false }) => {
  const buttonText = isCreateMode ? 'Complete Profile' : 'Save Changes';
  const ButtonIcon = isCreateMode ? UserCheck : Save;
  
  return (
    <div className="flex justify-end pt-6 border-t border-gray-200">
      <button
        type="submit"
        disabled={loading || disabled}
        className={`flex items-center gap-2 text-white px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed ${
          isCreateMode 
            ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700'
            : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600 hover:from-indigo-600 hover:via-purple-600 hover:to-blue-700'
        }`}
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            {isCreateMode ? 'Creating...' : 'Saving...'}
          </>
        ) : (
          <>
            <ButtonIcon size={20} />
            {buttonText}
          </>
        )}
      </button>
    </div>
  );
};

export default SubmitButton;