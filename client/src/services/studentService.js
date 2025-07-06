// API base configuration
import { API_BASE } from "../config/api";
const API_BASE2 = `${API_BASE}/api/students`;


const getUserId = () => {
  const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  if (!userId) {
    console.warn('No user ID found');
  }
  return userId;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  
  if (response.status === 401) {
    // Token expired or invalid
    console.warn('Authentication failed, clearing stored data');
    sessionStorage.removeItem('authtoken');
    // Don't clear userId as it might be temporary for demo
  }

  if (response.status === 403) {
    throw new Error('Access denied. You can only access your own data.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Operation failed');
  }

  return result.data || result; // Handle both formats
};

// 🔥 FIXED: Get common headers with proper authentication
const getHeaders = (isFormData = false) => {
  const headers = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const userId = localStorage.getItem('userId');
  if (userId) {
    headers['x-user-id'] = userId;
  }

  return headers;
};

// Authentication functions
export const login = async (credentials) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }

    const result = await response.json();
    console.log('✅ Login successful:', result);

    // Store authentication data
    if (credentials.rememberMe) {
      localStorage.setItem('userId', result.user.id);
    } else {
      
      sessionStorage.setItem('userId', result.user.id);
    }

    return result;
  } catch (error) {
    console.error('❌ Login failed:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include'
    });
  } catch (error) {
    console.warn('Logout request failed:', error.message);
  } finally {
    // Clear authentication data regardless of server response
   
    localStorage.removeItem('userId');
   
    sessionStorage.removeItem('userId');
    console.log('✅ Logged out successfully');
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const userId = localStorage.getItem('userId');
  const isAuth = !!userId;
  console.log('🔍 Auth check:', { hasUserId: !!userId, isAuth });
  return isAuth;
};

// 🔥 FIXED: Student API functions with proper authentication

// Fetch all students for the authenticated user
export const fetchStudents = async () => {
  try {
    console.log('📡 Fetching students...');
    const response = await fetch(`${API_BASE2}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include'
    });

    const result = await handleResponse(response);
    console.log('✅ Students fetched:', result);
    return result;
  } catch (error) {
    console.error('❌ Fetch students error:', error);
    throw error;
  }
};

// Delete a single student
export const deleteStudent = async (studentId) => {
  try {
    console.log('🗑️ Deleting student:', studentId);
    const response = await fetch(`${API_BASE2}/${studentId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getHeaders(),
    });

    const result = await handleResponse(response);
    console.log('✅ Student deleted:', result);
    return result;
  } catch (error) {
    console.error('❌ Delete student error:', error);
    throw error;
  }
};

// Delete multiple students
export const deleteMultipleStudents = async (studentIds) => {
  try {
    console.log('🗑️ Batch deleting students:', studentIds);
    const response = await fetch(`${API_BASE2}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ studentIds }),
    });

    const result = await handleResponse(response);
    console.log('✅ Students batch deleted:', result);
    return result;
  } catch (error) {
    console.error('❌ Batch delete error:', error);
    throw error;
  }
};

// Get single student by ID
export const getStudentById = async (studentId) => {
  try {
    console.log('👤 Fetching student by ID:', studentId);
    const response = await fetch(`${API_BASE2}/${studentId}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include'
    });

    const result = await handleResponse(response);
    console.log('✅ Student fetched by ID:', result);
    return result;
  } catch (error) {
    console.error('❌ Get student by ID error:', error);
    throw error;
  }
};

// 🔥 FIXED: Create new student with proper FormData handling
export const createStudent = async (studentData) => {
  try {
    console.log('➕ Creating student:', studentData);

    // Check if studentData contains a file
    const hasFile = studentData instanceof FormData ||
      (studentData && typeof studentData === 'object' && studentData.photo);

    let body;
    let isFormData = false;

    if (hasFile && !(studentData instanceof FormData)) {
      // Convert to FormData if file is present
      const formData = new FormData();
      Object.keys(studentData).forEach(key => {
        if (studentData[key] !== null && studentData[key] !== undefined) {
          formData.append(key, studentData[key]);
        }
      });
      body = formData;
      isFormData = true;
    } else if (studentData instanceof FormData) {
      body = studentData;
      isFormData = true;
    } else {
      body = JSON.stringify(studentData);
      isFormData = false;
    }

    const response = await fetch(API_BASE2, {
      method: 'POST',
      headers: getHeaders(isFormData),
      body: body,
      credentials: 'include',
    });

    const result = await handleResponse(response);
    console.log('✅ Student created:', result);
    return result;
  } catch (error) {
    console.error('❌ Create student error:', error);
    throw error;
  }
};

// 🔥 FIXED: Update student with proper FormData handling
export const updateStudent = async (studentId, studentData) => {
  try {
    console.log('✏️ Updating student:', studentId, studentData);

    // Check if studentData contains a file
    const hasFile = studentData instanceof FormData ||
      (studentData && typeof studentData === 'object' && studentData.photo);

    let body;
    let isFormData = false;

    if (hasFile && !(studentData instanceof FormData)) {
      // Convert to FormData if file is present
      const formData = new FormData();
      Object.keys(studentData).forEach(key => {
        if (studentData[key] !== null && studentData[key] !== undefined) {
          formData.append(key, studentData[key]);
        }
      });
      body = formData;
      isFormData = true;
    } else if (studentData instanceof FormData) {
      body = studentData;
      isFormData = true;
    } else {
      body = JSON.stringify(studentData);
      isFormData = false;
    }

    const response = await fetch(`${API_BASE2}/${studentId}`, {
      method: 'PUT',
      headers: getHeaders(isFormData),
      body: body,
      credentials: 'include',
    });

    const result = await handleResponse(response);
    console.log('✅ Student updated:', result);
    return result;
  } catch (error) {
    console.error('❌ Update student error:', error);
    throw error;
  }
};

// Search students
export const searchStudents = async (searchQuery) => {
  try {
    console.log('🔍 Searching students:', searchQuery);
    const queryParams = new URLSearchParams({
      search: searchQuery,
    });

    const response = await fetch(`${API_BASE2}/search?${queryParams}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const result = await handleResponse(response);
    console.log('✅ Search results:', result);
    return result;
  } catch (error) {
    console.error('❌ Search students error:', error);
    throw error;
  }
};

// Get student statistics
export const getStudentStats = async () => {
  try {
    console.log('📊 Fetching student stats...');
    const response = await fetch(`${API_BASE2}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include'
    });

    const result = await handleResponse(response);
    console.log('✅ Student stats:', result);
    return result;
  } catch (error) {
    console.error('❌ Get student stats error:', error);
    throw error;
  }
};

// Error handling wrapper for all API calls
export const withErrorHandling = (apiFunction) => {
  return async (...args) => {
    try {
      return await apiFunction(...args);
    } catch (error) {
      // Log error for debugging
      console.error('API Error:', error.message);

      // Re-throw for component handling
      throw error;
    }
  };
};

// Initialize user session (call this on app startup)
export const initializeUser = (userId = null, token = null) => {
  console.log('🚀 Initializing user session...');

  if (userId) {
    localStorage.setItem('userId', userId);
    console.log('✅ User ID set:', userId);
  } else if (!getUserId()) {
    // Create a demo user ID if none exists
    const demoUserId = 'demo_user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', demoUserId);
    console.log('✅ Created demo user ID:', demoUserId);
  }

  
  if (!token) {
    console.log(' Token is not Exitss');
  }

  
};
export { getHeaders };
