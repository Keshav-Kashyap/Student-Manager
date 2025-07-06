import React from "react";
import { Edit, Info, HelpCircle, LogOut } from "lucide-react";

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
    <div className="border-t border-white/20 pt-2">
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