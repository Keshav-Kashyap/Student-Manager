// components/NavLink.jsx
import React from "react";

const NavLink = ({ href, label, icon, onClick, className = "" }) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${className}`}
    >
      {icon}
      {label}
    </a>
  );
};

export default NavLink;
