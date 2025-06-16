import React from 'react';
import { Camera } from 'lucide-react';

const ProfileHeader = ({ name, email, profileImage, onImageChange }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative group">
        <img
          src={profileImage}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
        />
        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <Camera size={24} className="text-white" />
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
        </label>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mt-4">{name}</h2>
      <p className="text-gray-600">{email}</p>
    </div>
  );
};

export default ProfileHeader;