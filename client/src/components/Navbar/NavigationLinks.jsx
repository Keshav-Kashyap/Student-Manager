import React from "react";
import { BarChart3 } from "lucide-react";
import NavLink from "../NavLink";

const NavigationLinks = ({ className = "" }) => {
  const mainLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <BarChart3 size={18} /> },
  ];

  return (
    <div className={`flex space-x-8 font-medium ${className}`}>
      {mainLinks.map((link) => (
        <NavLink
          key={link.label}
          href={link.href}
          label={link.label}
          icon={link.icon}
          className="text-gray-700 hover:text-indigo-600 hover:bg-white/50 hover:shadow-md"
        />
      ))}
    </div>
  );
};

export default NavigationLinks;