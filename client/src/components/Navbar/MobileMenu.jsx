import React from "react";
import MobileUserSection from "./MobileUserSection";
import MobileNavigationLinks from "./MobileNavigationLinks";

const MobileMenu = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-gradient-to-b from-white/95 to-blue-50/90 backdrop-blur-lg shadow-xl border-t border-white/20">
      <MobileUserSection user={user} onClose={onClose} />
      <MobileNavigationLinks onClose={onClose} />
    </div>
  );
};

export default MobileMenu;
