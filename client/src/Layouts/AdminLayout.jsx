import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/Admin/AdminHeader';
import AdminSidebar from '../components/Admin/AdminSidebar';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Safe localStorage access
  const getSavedUser = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    return null;
  };

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUser = getSavedUser();
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Sidebar togglers
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Close sidebar on mobile resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // On desktop, always show sidebar
        setIsSidebarOpen(false);
      } else {
        // On mobile, close sidebar
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    if (typeof window !== 'undefined') {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <AdminHeader user={user} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* Admin Sidebar */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        {/* Main Content Area */}
        <main
          className={`
            flex-1 overflow-auto transition-all duration-300 ease-in-out
            ${isSidebarOpen && window?.innerWidth >= 1024 ? "lg:ml-80" : "lg:ml-0"}
          `}
        >
          <div className="p-0">
            <Outlet context={{ user, setUser }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;