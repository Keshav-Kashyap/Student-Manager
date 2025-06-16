import React from "react";
import { Menu, X } from "lucide-react";

const MobileMenuButton = ({ isOpen, onToggle }) => {
  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={onToggle}
        type="button"
        className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-white/50 focus:outline-none transition-all duration-300"
        aria-controls="mobile-menu"
        aria-expanded={isOpen}
      >
        <span className="sr-only">Open main menu</span>
        {!isOpen ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default MobileMenuButton;