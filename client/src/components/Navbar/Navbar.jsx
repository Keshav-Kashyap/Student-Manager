import React, { useState } from "react";
import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import MobileMenuButton from "./MobileMenuButton";

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
          {/* Left Side - Sidebar Toggle + Logo */}
          <div className="flex items-center space-x-4">
            <Logo user={user} />
          </div>

          {/* Desktop Menu */}
          <DesktopMenu user={user} />

          {/* Mobile Menu Button */}
          <MobileMenuButton 
            isOpen={isMobileMenuOpen}
            onToggle={handleMobileMenuToggle}
          />
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
