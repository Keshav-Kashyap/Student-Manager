// src/api/index.js
import axios from 'axios';

const API_URL = 'https://student-management-34a5.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// ✅ Interceptor to send token with every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authtoken'); // Fixed key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Sending token:', token);
  } else {
    console.warn('⚠️ No token found in localStorage');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ✅ Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });

    if (response.data.token) {
      // ✅ Store token and user
      localStorage.setItem('authtoken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // only user object

      console.log('✅ Token saved to localStorage');
    }

    return response.data;
  },

  register: async (name, email, password) => {
    const response = await api.post('/users/register', { name, email, password });

    if (response.data.token) {
      localStorage.setItem('authtoken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('✅ Registered & token saved');
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authtoken');
    localStorage.removeItem('user');
    console.log('🚪 Logged out');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  isAuthenticated: () => {
    return localStorage.getItem('authtoken') !== null;
  }
};

// ✅ Student API (Protected)
export const studentAPI = {
  getAll: async () => {
    const response = await api.get('/students');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },

  update: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  }
};
