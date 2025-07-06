// ProtectedRoute.jsx - Fixed version
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserManager } from "../../Utils/UserManager"; // Import centralized user manager

const ProtectedRoute = ({ allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        // First check raw localStorage data
        const rawData = localStorage.getItem('user');
        console.log('ProtectedRoute: Raw localStorage data:', rawData);
        
        const savedUser = UserManager.getSavedUser();
        console.log('ProtectedRoute: Loading user:', savedUser); // Debug log
        
        // Additional check for user data
        if (savedUser && (!savedUser.role)) {
          console.warn('User found but role missing, checking for alternative role fields');
          
          // Check for common role variations
          const roleFields = ['role', 'userRole', 'type', 'userType', 'accountType'];
          const foundRole = roleFields.find(field => savedUser[field]);
          
          if (foundRole) {
            console.log(`Found role in field '${foundRole}':`, savedUser[foundRole]);
            savedUser.role = savedUser[foundRole];
          } else {
            console.log('No role field found, defaulting to teacher');
            savedUser.role = 'teacher'; // Default role
          }
          
          // Update localStorage with corrected data
          localStorage.setItem('user', JSON.stringify(savedUser));
        }
        
        setUser(savedUser);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listen for user data changes
    const handleUserDataChange = (event) => {
      const userData = event.detail;
      console.log('ProtectedRoute: User data changed:', userData); // Debug log
      setUser(userData);
    };

    // Listen for localStorage changes (cross-tab sync)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        console.log('ProtectedRoute: Storage changed, reloading user'); // Debug log
        loadUser();
      }
    };

    window.addEventListener('userDataChanged', handleUserDataChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('userDataChanged', handleUserDataChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Show loading while checking user
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to login'); // Debug log
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute: User role not allowed:', user.role, 'Allowed:', allowedRoles); // Debug log
    // Redirect to appropriate dashboard based on role
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === "teacher") {
      return <Navigate to="/app/dashboard" replace />;
    } else {
      // Unknown role, redirect to login
      return <Navigate to="/login" replace />;
    }
  }

  console.log('ProtectedRoute: User authorized, allowing access'); // Debug log
  // User has correct role, allow access
  return <Outlet />;
};

export default ProtectedRoute;