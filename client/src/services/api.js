// src/api/index.js
import axios from 'axios';
import { API_BASE } from '../config/api';

// Create axios instance with cookie support
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // 🔑 Essential for cookie-based auth
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);

    // Handle 401 - Cookie expired/invalid
    if (error.response?.status === 401) {
      console.log('🚪 Authentication failed, redirecting to login...');
      // Clear any local user data
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ✅ Auth API optimized for cookie-based authentication
export const authAPI = {
  login: async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);

      const response = await api.post('/users/login', {
        email: email.trim(),
        password
      });

      console.log('✅ Login response:', response.data);

      if (response.data.success) {
        // Store user data for UI purposes
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('isAuthenticated', 'true');
        }

        console.log('✅ Login successful, user data saved');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  register: async (name, email, password) => {
    try {
      console.log('📝 Attempting registration for:', email);

      const response = await api.post('/users/register', {
        name: name.trim(),
        email: email.trim(),
        password
      });

      console.log('✅ Register response:', response.data);

      if (response.data.success) {
        // For registration, don't save auth state if email verification is required
        if (response.data.requiresEmailVerification) {
          console.log('📧 Email verification required');
          return response.data;
        }

        // If no verification needed, save user data
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('isAuthenticated', 'true');
        }

        console.log('✅ Registration successful');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Call logout endpoint to clear server-side cookie
      await api.post('/users/logout');
      console.log('✅ Server logout successful');
    } catch (error) {
      console.error('❌ Server logout error:', error);
      // Continue with client cleanup even if server call fails
    } finally {
      // Clear client-side data
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      console.log('🚪 Client logout complete');
    }
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('👤 Current user from localStorage:', user);
        return user;
      }
      return null;
    } catch (error) {
      console.error('❌ Error parsing user from localStorage:', error);
      return null;
    }
  },

  isAuthenticated: () => {
    // Check if user data exists (cookie auth is handled by server)
    const user = localStorage.getItem('user');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const hasAuth = !!(user && isAuth);
    console.log('🔍 Authentication check:', hasAuth);
    return hasAuth;
  },

  // ✅ Fetch fresh user data from server (uses cookie automatically)
  refreshUser: async () => {
    try {
      console.log('🔄 Refreshing user data...');
      const response = await api.get('/users/profile');
      
      console.log('✅ Refresh user response:', response.data);
      
      if (response.data.success) {
        const userData = response.data.data || response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        return userData;
      }
      return null;
    } catch (error) {
      console.error('❌ Error refreshing user:', error.response?.data || error.message);
      
      // If 401, clear auth data
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
      
      throw error;
    }
  },

  // ✅ Check auth status from server
  checkAuthStatus: async () => {
    try {
      const response = await api.get('/users/status');
      return response.data;
    } catch (error) {
      console.error('❌ Auth status check error:', error);
      throw error;
    }
  },

  // ✅ Email verification methods
  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/users/verify-email?token=${token}`);
      return response.data;
    } catch (error) {
      console.error('❌ Email verification error:', error);
      throw error;
    }
  },

  resendVerificationEmail: async (email) => {
    try {
      const response = await api.post('/users/resend-verification', { email });
      return response.data;
    } catch (error) {
      console.error('❌ Resend verification error:', error);
      throw error;
    }
  },

  // ✅ Password reset methods
  forgotPassword: async (email) => {
    try {
      console.log('📧 Requesting password reset for:', email);
      
      const response = await api.post('/users/forgot-password', {
        email: email.trim()
      });

      console.log('✅ Forgot password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Forgot password error:', error.response?.data || error.message);
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      console.log('🔐 Resetting password with token:', token);
      
      const response = await api.post('/users/reset-password', {
        token: token.trim(),
        newPassword: newPassword.trim()
      });

      console.log('✅ Reset password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Reset password error:', error.response?.data || error.message);
      throw error;
    }
  }
};

// ✅ Student API (unchanged - uses cookies automatically)
export const studentAPI = {
  getAll: async () => {
    try {
      console.log('📚 Fetching all students...');
      const response = await api.get('/students');
      console.log('✅ Students fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching students:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      console.log('👤 Fetching student by ID:', id);
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching student:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (studentData) => {
    try {
      console.log('➕ Creating new student:', studentData);
      const response = await api.post('/students', studentData);
      console.log('✅ Student created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating student:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id, studentData) => {
    try {
      console.log('✏️ Updating student:', id, studentData);
      const response = await api.put(`/students/${id}`, studentData);
      console.log('✅ Student updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating student:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log('🗑️ Deleting student:', id);
      const response = await api.delete(`/students/${id}`);
      console.log('✅ Student deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting student:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default api;