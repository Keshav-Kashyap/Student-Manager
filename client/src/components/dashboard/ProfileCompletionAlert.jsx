import React from 'react';
import { Settings } from 'lucide-react';

const ProfileCompletionAlert = ({ user, isProfileComplete }) => {
  if (!user || isProfileComplete) return null;

  return (
    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
          <Settings size={16} className="text-yellow-600" />
        </div>
        <div>
          <h3 className="font-semibold text-yellow-800">Complete Your Profile</h3>
          <p className="text-yellow-700 text-sm">
            Add your college name and department to personalize your experience.
          </p>
        </div>
        <button 
          onClick={() => window.location.href = '/app/edit'}
          className="ml-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Complete Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCompletionAlert;