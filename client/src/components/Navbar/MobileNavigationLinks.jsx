// 4. Updated MobileNavigationLinks.js - Dashboard ko top section banaya
import React from "react";
import { BarChart3 } from "lucide-react";
import NavLink from "../NavLink";

const MobileNavigationLinks = ({ onClose }) => {
  const mainLinks = [
  
  ];

  return (
    <div className="border-b border-white/20 pb-2">
      {mainLinks.map((link) => (
        <NavLink
          key={link.label}
          href={link.href}
          label={link.label}
          icon={link.icon}
          className="px-6 py-4 text-gray-700 hover:bg-white/50 hover:text-indigo-600 font-medium"
          onClick={onClose}
        />
      ))}
    </div>
  );
};

export default MobileNavigationLinks;