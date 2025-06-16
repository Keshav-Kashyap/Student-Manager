// components/Sidebar.jsx
import React from "react";
import { X } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { getSidebarNavigationItems } from "../constants/navigationItems";

const Sidebar = ({ isOpen, onClose, className }) => {
  const menuItems = getSidebarNavigationItems();

  const handleMenuClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 z-50
        bg-gradient-to-b from-blue-50/95 via-white/90 to-indigo-50/95 
        backdrop-blur-lg shadow-2xl border-r border-white/30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)] lg:shadow-xl
        ${className}
      `}>
        <div className="p-6 h-full flex flex-col overflow-y-auto">
          
          {/* Close Button for Mobile */}
          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
              Main Menu
            </h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name} onClick={handleMenuClick}>
                  <SidebarItem
                    href={item.href}
                    icon={item.icon}
                    name={item.name}
                  />
                </li>
              ))}
            </ul>
          </div>
          
         
        </div>
      </div>
    </>
  );
};

export default Sidebar;