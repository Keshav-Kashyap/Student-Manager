// ✅ ProtectedRoute.jsx (Backend-first + Fallback to UserManager)
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserManager } from '../../Utils/UserManager';
import { API_BASE } from '../../config/api';
const ProtectedRoute = ({ allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Always check session from backend first
  const fetchUserSession = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await res.json();
      if (res.ok && result.success) {
        const userData = result.data;
        UserManager.saveUser(userData);
        setUser(userData);
      } else {
        UserManager.clearUser();
        setUser(null);
      }
    } catch (err) {
      console.error('🔴 Session check failed:', err);
      UserManager.clearUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSession();

    // 👂 Listen for manual localStorage change
    const onStorageChange = (e) => {
      if (e.key === 'user') {
        setUser(UserManager.getSavedUser());
      }
    };
    window.addEventListener('storage', onStorageChange);

    return () => {
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    console.warn('❌ Not authenticated');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.warn(`⛔ Not authorized (Role: ${user.role})`);
    return user.role === 'admin'
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
