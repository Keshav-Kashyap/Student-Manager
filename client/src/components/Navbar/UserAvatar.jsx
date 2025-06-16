import React from "react";
import { User } from "lucide-react";

const UserAvatar = ({ user, size = "sm" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };

  return (
    <>
      {user?.profileImage? (
        <img
          src={user.profileImage}
          alt="User Avatar"
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center`}>
          <User size={iconSizes[size]} className="text-white" />
        </div>
      )}
    </>
  );
};

export default UserAvatar;