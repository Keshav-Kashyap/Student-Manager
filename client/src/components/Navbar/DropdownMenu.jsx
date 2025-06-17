import React from "react";
import { Edit, Info, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Utils/auth"; // ✅ Import utility

const DropdownMenu = ({ isOpen, onClose, position = "desktop" }) => {
  const navigate = useNavigate();

  const userDropdownItems = [
    { href: "/edit", label: "Edit Profile", icon: <Edit size={16} /> },
    { href: "/about", label: "About", icon: <Info size={16} /> },
    { href: "/help", label: "Help", icon: <HelpCircle size={16} /> },
    { href: "/logout", label: "Logout", icon: <LogOut size={16} /> },
  ];

  const handleClick = (e, item) => {
    if (item.label === "Logout") {
      e.preventDefault();
      logoutUser(navigate); // ✅ Use the utility
    }
    onClose(); // Close the dropdown in any case
  };

  if (!isOpen) return null;

  const baseClasses = "flex items-center space-x-3 transition-all duration-200";
  const desktopClasses =
    position === "desktop"
      ? "absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 py-2 z-50"
      : "";

  return (
    <div className={desktopClasses}>
      {userDropdownItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className={`${baseClasses} px-4 py-3 ${
            item.label === "Logout"
              ? "text-red-600 hover:bg-red-50 hover:text-red-700"
              : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          }`}
          onClick={(e) => handleClick(e, item)}
        >
          {item.icon}
          <span>{item.label}</span>
        </a>
      ))}
    </div>
  );
};

export default DropdownMenu;
