// components/Admin/AdminSidebar.jsx
import React, { useState, useEffect } from "react";
import { X, LayoutDashboard, Users, Settings, BarChart3, FileText, Shield } from "lucide-react";
import AdminSidebarItem from "./AdminSidebarItem";
import { API_BASE } from '../../config/api';

const AdminSidebar = ({ isOpen, onClose, className }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin specific menu items
  const adminMenuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: "User Management",
      href: "/users",
      icon: Users,
     
    },
  ];

  // Get admin data from localStorage
  const getAdminData = () => {
    try {
      const adminData = localStorage.getItem('user'); // or 'admin' if stored separately
      if (adminData) {
        const parsedAdmin = JSON.parse(adminData);
        setAdmin(parsedAdmin);
        return parsedAdmin;
      }
    } catch (error) {
      console.error('Error parsing admin data:', error);
    }
    return null;
  };

  // Fetch admin profile from backend
  const fetchAdminProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/profile/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const adminData = await response.json();

        const updatedAdminData = {
          ...adminData,
          isAuthenticated: true,
          lastFetch: new Date().toISOString()
        };

        localStorage.setItem('user', JSON.stringify(updatedAdminData));
        setAdmin(updatedAdminData);
      } else {
        console.error('Failed to fetch admin profile');
        getAdminData();
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      getAdminData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const localAdmin = getAdminData();
    fetchAdminProfile();
  }, []);

  const handleMenuClick = () => {
    if (onClose) {
      onClose();
    }
  };

  // Helper function to get admin initials
  const getAdminInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
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

      {/* Admin Sidebar */}
      <div className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 z-50
        bg-gradient-to-b from-purple-50/95 via-white/90 to-indigo-50/95 
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

          {/* Admin Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Admin Panel</h2>
                <p className="text-purple-100 text-sm">Management Dashboard</p>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
              Admin Menu
            </h3>
            <ul className="space-y-2">
              {adminMenuItems.map((item) => (
                <li key={item.name} onClick={handleMenuClick}>
                  <AdminSidebarItem
                    href={item.href}
                    icon={item.icon}
                    name={item.name}
                    badge={item.badge}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Info Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            {loading ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">
                      {getAdminInitials(admin?.name || admin?.firstName)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {admin?.name || `${admin?.firstName || ''} ${admin?.lastName || ''}`.trim() || 'Admin User'}
                    </p>
                    <p className="text-xs text-purple-600 font-medium">
                      {admin?.role || 'Super Administrator'}
                    </p>
                  </div>
                </div>
                
                {/* Admin Details */}
                <div className="space-y-2 text-xs">
                  {admin?.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 min-w-12">Email:</span>
                      <span className="text-gray-700 truncate">{admin.email}</span>
                    </div>
                  )}
                  {admin?.contact && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 min-w-12">Contact:</span>
                      <span className="text-gray-700">{admin.contact}</span>
                    </div>
                  )}
                  {admin?.department && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 min-w-12">Dept:</span>
                      <span className="text-gray-700 truncate">{admin.department}</span>
                    </div>
                  )}
                  {admin?.collegeName && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 min-w-12">College:</span>
                      <span className="text-gray-700 truncate">{admin.collegeName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;