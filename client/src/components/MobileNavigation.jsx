// components/MobileNavigation.jsx - Updated with proper spacing
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMobileNavigationItems } from '../constants/navigationItems';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = getMobileNavigationItems();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 w-full z-50">
      <div className="flex justify-around items-center py-1.5 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path ||
                           (item.id === 'students' && location.pathname.includes('/students'));
                          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Icon 
                size={18}
                className={`mb-0.5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
              />
              <span className={`text-xs font-medium ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;