// src/handlers/authHandlers.js
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { API_BASE } from '../config/api';

export const handleLogin = async ({ formData, setLoading, setError, navigate }) => {
  setLoading(true);
  setError('');

  try {
    const response = await authAPI.login(formData.email, formData.password);
    toast.success('Login successful!');

    const { token, user } = response;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/app/dashboard');
    }
  } catch (error) {
    let errorMessage = error?.response?.data?.message || error.message || 'Login failed.';
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

export const handleSignup = async ({ formData, setLoading, setError, navigate }) => {
  setLoading(true);
  setError('');

  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    setLoading(false);
    return;
  }

  if (formData.password.length < 6) {
    setError('Password must be at least 6 characters');
    setLoading(false);
    return;
  }

  try {
    const response = await authAPI.register(formData.name, formData.email, formData.password);
    const resData = response.data || response;

    const userData = {
      id: resData._id || resData.id,
      name: formData.name,
      email: formData.email,
      isNewUser: true,
      isProfileComplete: false,
    };

    navigate('/verify-email', {
      state: {
        userData,
        isNewUser: true,
        fromSignup: true,
      },
      replace: true
    });
  } catch (error) {
    let errorMessage = error?.response?.data?.message || error.message || 'Signup failed.';
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

export const handleGoogleLogin = () => {
  window.location.href = `${API_BASE}/auth/google`;
};

export const handleFacebookLogin = () => {
  toast('Facebook login is not implemented yet.', { icon: '⚠️' });
};
