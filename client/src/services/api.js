// src/api/index.js
import axios from 'axios';
// Inside any file where API calls are made
import { API_BASE } from '../config/api'; // ✅ adjust path as needed


// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// ✅ Request Interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authtoken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No auth token found');
    }
    
    // Log request details for debugging
    console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor - Handle common errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    
    // Handle 401 - Unauthorized (token expired/invalid)
    if (error.response?.status === 401) {
      console.log('🚪 Token expired, logging out...');
      authAPI.logout();
      window.location.href = '/login'; // Redirect to login
    }
    
    return Promise.reject(error);
  }
);

// ✅ Auth API with better error handling
export const authAPI = {
  login: async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const response = await api.post('/users/login', { 
        email: email.trim(), 
        password 
      });
      
      console.log('✅ Login response:', response.data);
      
      if (response.data.success && response.data.token) {
        // Store token and user data
        localStorage.setItem('authtoken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        console.log('✅ Login successful, token saved');
        return response.data;
      } else {
        throw new Error('Login failed: No token received');
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
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('authtoken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        console.log('✅ Registration successful, token saved');
        return response.data;
      } else {
        throw new Error('Registration failed: No token received');
      }
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('authtoken');
    localStorage.removeItem('user');
    console.log('🚪 User logged out, localStorage cleared');
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('👤 Current user:', user);
        return user;
      }
      return null;
    } catch (error) {
      console.error('❌ Error parsing user from localStorage:', error);
      return null;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('authtoken');
    const user = localStorage.getItem('user');
    const isAuth = !!(token && user);
    console.log('🔍 Authentication check:', isAuth);
    return isAuth;
  },

  // ✅ New method to refresh user data
  refreshUser: async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
    } catch (error) {
      console.error('❌ Error refreshing user:', error);
      return null;
    }
  }
};

// ✅ Student API with better error handling
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

// ✅ Export API instance for direct use if needed
export default api;