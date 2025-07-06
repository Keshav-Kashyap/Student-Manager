// 📁 src/hooks/useUser.js
import { useState, useEffect } from 'react';
import { API_BASE } from '../config/api';

const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Useful for UI
  const [error, setError] = useState(null);

  const getUserFromLocal = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error("❌ Error parsing user data:", error);
    }
    return null;
  };

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/profile/me`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profile = await res.json();
      const updatedUser = {
        ...profile,
        isAuthenticated: true,
        lastSync: new Date().toISOString()
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error("❌ Error fetching user profile:", err);
      setError(err.message);
      // fallback to local data
      const fallbackUser = getUserFromLocal();
      if (fallbackUser) setUser(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const localUser = getUserFromLocal();
    if (localUser) setUser(localUser);
    fetchUserProfile();
  }, []);

  return { user, loading, error, refreshUser: fetchUserProfile };
};

export default useUser;