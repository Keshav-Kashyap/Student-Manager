// components/SidebarItem.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarItem = ({ href, icon: Icon, name }) => {
  const location = useLocation();
  const basePath = "/app";
  const isActive = location.pathname === `${basePath}${href}`;

  return (
    <li>
      <Link
        to={href}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group w-full relative overflow-hidden
          ${isActive 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-[1.02]' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm hover:transform hover:translate-x-1'
          }
        `}
      >
        {/* Active state background glow */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 blur-xl"></div>
        )}
        
        {/* Animated background on hover */}
        <div className={`
          absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100
          ${!isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : ''}
        `}></div>
        
        {/* Left accent indicator */}
        <div className={`
          absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300
          ${isActive 
            ? 'h-8 bg-white/80' 
            : 'h-0 bg-blue-500 group-hover:h-6'
          }
        `}></div>
        
        {/* Icon with enhanced styling */}
        <div className={`
          relative z-10 p-1.5 rounded-lg transition-all duration-300
          ${isActive 
            ? 'bg-white/20 backdrop-blur-sm' 
            : 'group-hover:bg-blue-50 group-hover:scale-110'
          }
        `}>
          <Icon 
            size={18}
            className={`
              transition-all duration-300
              ${isActive 
                ? 'text-white drop-shadow-sm' 
                : 'text-gray-500 group-hover:text-blue-600'
              }
            `} 
          />
        </div>
        
        {/* Text with improved typography */}
        <span className={`
          relative z-10 font-medium select-none transition-all duration-300
          ${isActive 
            ? 'text-white font-semibold tracking-wide' 
            : 'text-gray-700 group-hover:text-gray-900 group-hover:font-medium'
          }
        `}>
          {name}
        </span>

        {/* Subtle shine effect for active state */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 w-full transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
        )}
      </Link>
    </li>
  );
};

export default SidebarItem;