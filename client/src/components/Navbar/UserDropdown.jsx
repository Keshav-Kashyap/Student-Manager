import React, { useState, useRef, useEffect } from "react";
import { User, ChevronDown } from "lucide-react";
import UserAvatar from "./UserAvatar";
import DropdownMenu from "./DropdownMenu";

const UserDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-2 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-white/50 focus:outline-none transition-all duration-300"
      >
        <UserAvatar user={user} size="sm" />
        <span className="font-medium">{user?.name || "User"}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      <DropdownMenu 
        isOpen={isOpen}
        onClose={closeDropdown}
        position="desktop"
      />
    </div>
  );
};

export default UserDropdown;