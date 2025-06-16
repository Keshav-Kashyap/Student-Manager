// 📁 src/hooks/useProfile.js
import { useState, useEffect } from 'react';

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProfileFromLocal = () => {
    try {
      const profileData = localStorage.getItem('userProfile');
      if (profileData) {
        return JSON.parse(profileData);
      }
    } catch (error) {
      console.error("❌ Error parsing profile data:", error);
    }
    return null;
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setError('No token found');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/profile/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profileData = await res.json();
      console.log("✅ Profile data fetched:", profileData);
      
      // Store complete profile data
      const completeProfile = {
        ...profileData,
        isAuthenticated: true,
        lastSync: new Date().toISOString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(completeProfile));
      localStorage.setItem('user', JSON.stringify(completeProfile)); // For backward compatibility
      setProfile(completeProfile);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      setError(err.message);
      
      // Fallback to local data
      const fallbackProfile = getProfileFromLocal();
      if (fallbackProfile) {
        setProfile(fallbackProfile);
      }
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      setLoading(true);
      const res = await fetch('/api/profile/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create profile');
      }

      const result = await res.json();
      console.log("✅ Profile created:", result);
      
      // Refresh profile data after creation
      await fetchUserProfile();
      return result;
    } catch (err) {
      console.error("❌ Error creating profile:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      setLoading(true);
      const res = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await res.json();
      console.log("✅ Profile updated:", result);
      
      // Refresh profile data after update
      await fetchUserProfile();
      return result;
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem('userProfile');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    // Load from localStorage first for immediate UI update
    const localProfile = getProfileFromLocal();
    if (localProfile) {
      setProfile(localProfile);
    }
    
    // Then fetch fresh data from API
    fetchUserProfile();
  }, []);

  return { 
    profile, 
    loading, 
    error, 
    refreshProfile: fetchUserProfile,
    createProfile,
    updateProfile,
    clearProfile
  };
};

export default useProfile;