import React, { useState } from "react";
import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import UserAvatar from "./UserAvatar";

const Navbar = ({ user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-white/95 via-blue-50/90 to-purple-50/95 backdrop-blur-lg shadow-xl border-b border-white/20 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo */}
          <div className="flex items-center space-x-4">
            <Logo user={user} />
          </div>

          {/* Desktop Menu */}
          <DesktopMenu user={user} />

          {/* Mobile Menu Button - Replace with UserAvatar */}
          <div className="md:hidden flex items-center">
            <button
              onClick={handleMobileMenuToggle}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-white/50 focus:outline-none transition-all duration-300"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <UserAvatar user={user} size="sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        user={user}
      />
    </nav>
  );
};

export default Navbar;