import React from "react";
import { Edit, Info, HelpCircle, LogOut } from "lucide-react";
import UserAvatar from "./UserAvatar";

const MobileUserSection = ({ user, onClose }) => {
  const userDropdownItems = [
    { href: "/edit", label: "Edit Profile", icon: <Edit size={18} /> },
    { href: "/about", label: "About", icon: <Info size={18} /> },
    { href: "/help", label: "Help", icon: <HelpCircle size={18} /> },
    { href: "/logout", label: "Logout", icon: <LogOut size={18} /> },
  ];

  const handleLogout = () => {
    console.log("Logging out...");
    // Add your logout logic here
  };

  const handleClick = (e, item) => {
    if (item.label === 'Logout') {
      e.preventDefault();
      handleLogout();
    }
    onClose();
  };

  return (
    <div className="border-b border-white/20 pb-2">
      {/* User Profile Info */}
      <div className="flex items-center px-6 py-4 space-x-3">
        <UserAvatar user={user} size="lg" />
        <div>
          <div className="font-semibold text-gray-800 text-lg">
            {user?.name || "User"}
          </div>
          <div className="text-sm text-gray-600">
            {user?.college || "University"}
          </div>
        </div>
      </div>
      
      {/* Mobile User Menu Items */}
      {userDropdownItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className={`flex items-center space-x-3 px-6 py-3 transition-all duration-200 ${
            item.label === 'Logout' 
              ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
              : 'text-gray-700 hover:bg-white/50 hover:text-indigo-600'
          }`}
          onClick={(e) => handleClick(e, item)}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </a>
      ))}
    </div>
  );
};

export default MobileUserSection;