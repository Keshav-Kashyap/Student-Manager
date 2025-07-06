// AdminHeader.jsx
import React from 'react';
import { Bell, Settings, LogOut, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../Utils/auth'; // ✅ Import utility
import UserAvatar from '../Navbar/UserAvatar';

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logoutUser(navigate); // ✅ Use the utility function
  };

  return (
    <header className="bg-white backdrop-blur-md bg-opacity-95 shadow-xl border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-3 mr-4 shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Student ID Card System
              </h1>
              <p className="text-gray-600 font-medium">Admin Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notification Button */}
      
            
      
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium hover:shadow-md"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;