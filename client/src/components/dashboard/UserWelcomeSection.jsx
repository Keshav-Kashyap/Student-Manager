import React from 'react';
import { User, Settings } from 'lucide-react';

const UserWelcomeSection = ({ user, isProfileComplete }) => {
  if (!user) return null;

  return (
    <div className="mt-4 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Welcome back, {user.name || user.email}!
          </h2>
          <div className="mt-2 space-y-1">
            {user.collegeName && (
              <p className="text-indigo-100 flex items-center gap-2">
                <span className="font-medium">Institution:</span> {user.collegeName}
              </p>
            )}
            {user.department && (
              <p className="text-indigo-100 flex items-center gap-2">
                <span className="font-medium">Department:</span> {user.department}
              </p>
            )}
            {user.designation && (
              <p className="text-indigo-100 flex items-center gap-2">
                <span className="font-medium">Designation:</span> {user.designation}
              </p>
            )}
            {!isProfileComplete && (
              <p className="text-yellow-200 mt-2 flex items-center gap-2">
                <Settings size={16} />
                Complete your profile to see more details
              </p>
            )}
          </div>
        </div>
        
        {/* Profile Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={32} className="text-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserWelcomeSection;