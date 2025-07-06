// pages/auth/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, KeyRound, CheckCircle } from "lucide-react";

// Import reusable components
import AuthLayout from '../../components/auth/AuthLayout';
import AuthHeader from '../../components/auth/AuthHeader';
import InputField from '../../components/auth/InputField';
import ErrorMessage from '../../components/auth/ErrorMessage';
import AuthButton from '../../components/auth/AuthButton';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get('token');
    
    if (urlToken) {
      setToken(urlToken);
      setTokenValid(true);
    } else {
      setError('Invalid reset link. Please request a new password reset.');
      setTokenValid(false);
    }
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validatePasswords = () => {
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validatePasswords()) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.resetPassword(token, formData.newPassword);
      console.log('🔍 Reset password response:', response);

      if (response.success) {
        setIsSuccess(true);
        toast.success('Password reset successful!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Reset password error:', error);

      let errorMessage = 'Failed to reset password. Please try again.';

      if (error.response?.data) {
        const { message } = error.response.data;
        errorMessage = message || errorMessage;
        
        // Handle invalid or expired token
        if (message && message.includes('invalid') || message.includes('expired')) {
          setTokenValid(false);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show success screen
  if (isSuccess) {
    return (
      <AuthLayout>
        <AuthHeader
          title="Password Reset Successful!"
          subtitle="Your password has been updated successfully"
          icon={<CheckCircle className="w-10 h-10 text-white" />}
        />

        <div className="text-center space-y-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              All Set!
            </h3>
            <p className="text-gray-300 text-sm">
              Your password has been reset successfully. You can now login with your new password.
            </p>
          </div>

          <div className="text-sm text-gray-400">
            <p>Redirecting to login in 3 seconds...</p>
          </div>
        </div>

        {/* Login Button */}
        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 transform hover:scale-105"
          >
            Continue to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // Show error screen for invalid token
  if (tokenValid === false) {
    return (
      <AuthLayout>
        <AuthHeader
          title="Invalid Reset Link"
          subtitle="This password reset link is invalid or has expired"
          icon={<KeyRound className="w-10 h-10 text-white" />}
        />

        <div className="text-center space-y-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              Link Expired
            </h3>
            <p className="text-gray-300 text-sm">
              This password reset link is invalid or has expired. Please request a new password reset.
            </p>
          </div>
        </div>

        {/* Request New Reset */}
        <div className="mt-8 text-center">
          <Link
            to="/forgot-password"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 transform hover:scale-105"
          >
            Request New Reset Link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="Reset Your Password"
        subtitle="Enter your new password below"
        icon={<KeyRound className="w-10 h-10 text-white" />}
      />

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <InputField
            label="New Password"
            type={showPassword ? "text" : "password"}
            name="newPassword"
            placeholder="Enter your new password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            disabled={loading}
            icon={<Lock className="w-5 h-5" />}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-300 transition duration-200"
            disabled={loading}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="relative">
          <InputField
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
            icon={<Lock className="w-5 h-5" />}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-300 transition duration-200"
            disabled={loading}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Password Requirements:</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li className={`flex items-center ${formData.newPassword.length >= 6 ? 'text-green-400' : 'text-gray-400'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${formData.newPassword.length >= 6 ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              At least 6 characters
            </li>
            <li className={`flex items-center ${formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword ? 'text-green-400' : 'text-gray-400'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              Passwords match
            </li>
          </ul>
        </div>

        <AuthButton
          loading={loading}
          loadingText="Resetting Password..."
        >
          Reset Password
        </AuthButton>
      </form>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-blue-400 hover:text-purple-400 text-sm transition duration-200"
        >
          Back to Login
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-300">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-purple-400 font-semibold transition duration-200"
          >
            Create Account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;