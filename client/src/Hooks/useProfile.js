import { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE } from '../config/api';

const PROFILE_STORAGE_KEY = 'userProfile';
const LEGACY_USER_STORAGE_KEY = 'user';

const safeParseStorage = (key) => {
  const raw = localStorage.getItem(key);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (parseError) {
    console.error(`Failed to parse ${key} from localStorage:`, parseError);
    localStorage.removeItem(key);
    return null;
  }
};

const withProfileMeta = (profileData) => ({
  ...profileData,
  isAuthenticated: true,
  lastSync: new Date().toISOString(),
});

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const activeRequestRef = useRef(0);

  const getCachedProfile = useCallback(() => {
    const cachedProfile = safeParseStorage(PROFILE_STORAGE_KEY);

    if (cachedProfile) {
      return cachedProfile;
    }

    const legacyProfile = safeParseStorage(LEGACY_USER_STORAGE_KEY);
    if (legacyProfile) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(legacyProfile));
    }

    return legacyProfile;
  }, []);

  const clearProfile = useCallback(() => {
    if (isMountedRef.current) {
      setProfile(null);
      setError(null);
    }
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
  }, []);

  const fetchUserProfile = useCallback(async ({ force = false } = {}) => {
    const requestId = ++activeRequestRef.current;
    const isLatestRequest = () => requestId === activeRequestRef.current;

    let cachedProfile = null;
    if (!force) {
      cachedProfile = getCachedProfile();

      // Show cached profile instantly but still fetch fresh data in background.
      if (cachedProfile && isMountedRef.current && isLatestRequest()) {
        setProfile(cachedProfile);
        setLoading(false);
      }
    }

    if (isMountedRef.current && isLatestRequest()) {
      if (!cachedProfile || force) {
        setLoading(true);
      }
      setError(null);
    }

    try {
      const res = await fetch(`${API_BASE}/api/profile/me`, {
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          clearProfile();
          if (isMountedRef.current && isLatestRequest()) {
            setError('Not authenticated');
          }
          return null;
        }

        let message = 'Failed to fetch profile';
        try {
          const errorData = await res.json();
          if (errorData?.message) {
            message = errorData.message;
          }
        } catch {
          // Ignore JSON parse failures and keep fallback message.
        }

        throw new Error(message);
      }

      const profileData = await res.json();
      const completeProfile = withProfileMeta(profileData);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(completeProfile));

      if (isMountedRef.current && isLatestRequest()) {
        setProfile(completeProfile);
        setError(null);
      }

      return completeProfile;
    } catch (err) {
      const message = err?.message || 'Failed to fetch profile';
      console.error('Error fetching profile:', err);

      if (isMountedRef.current && isLatestRequest()) {
        setError(message);

        // For network/server issues, keep showing cached data if available.
        const fallbackProfile = cachedProfile || getCachedProfile();
        if (fallbackProfile) {
          setProfile(fallbackProfile);
        }
      }

      return null;
    } finally {
      if (isMountedRef.current && isLatestRequest()) {
        setLoading(false);
      }
    }
  }, [clearProfile, getCachedProfile]);

  const runProfileMutation = useCallback(async (url, method, profileData, defaultError) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) {
        if (res.status === 401) {
          clearProfile();
          throw new Error('Not authenticated');
        }

        let message = defaultError;
        try {
          const errorData = await res.json();
          if (errorData?.message) {
            message = errorData.message;
          }
        } catch {
          // Ignore JSON parse failures and keep fallback message.
        }

        throw new Error(message);
      }

      const result = await res.json();
      await fetchUserProfile({ force: true });
      return result;
    } catch (err) {
      const message = err?.message || defaultError;
      setError(message);
      console.error('Profile mutation error:', err);
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [clearProfile, fetchUserProfile]);

  const createProfile = useCallback(async (profileData) => runProfileMutation(
    `${API_BASE}/api/profile/create`,
    'POST',
    profileData,
    'Failed to create profile'
  ), [runProfileMutation]);

  const updateProfile = useCallback(async (profileData) => runProfileMutation(
    `${API_BASE}/api/profile/update`,
    'PUT',
    profileData,
    'Failed to update profile'
  ), [runProfileMutation]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchUserProfile();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchUserProfile]);

  return {
    profile,
    loading,
    error,
    refreshProfile: () => fetchUserProfile({ force: true }),
    createProfile,
    updateProfile,
    clearProfile,
  };
};

export default useProfile;