import React from "react";
import { User } from "lucide-react";

// Define size mappings
const sizeClasses = {
  sm: "w-10 h-10 text-base",
  md: "w-14 h-14 text-lg",
  lg: "w-20 h-20 text-xl",
};

const UserAvatar = ({ user, size = "sm" }) => {
  const localUserString = localStorage.getItem("user");
  let localUser = null;

  try {
    localUser = localUserString ? JSON.parse(localUserString) : null;
    console.log("✅ Parsed local user:", localUser);
  } catch (e) {
    console.error("❌ Error parsing local user:", e);
  }

  const avatarSize = sizeClasses[size] || sizeClasses.sm;
  const displayLetter =
    (localUser?.name || localUser?.firstName || "U").charAt(0).toUpperCase();

  return (
    <>
      {localUser?.profileImage ? (
        <img
          src={localUser.profileImage}
          alt="User Avatar"
          className={`${avatarSize} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${avatarSize} bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg`}
        >
          <span className="text-white font-bold">{displayLetter}</span>
        </div>
      )}
    </>
  );
};

export default UserAvatar;
