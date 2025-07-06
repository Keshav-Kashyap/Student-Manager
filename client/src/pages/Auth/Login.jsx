// pages/auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { API_BASE } from "../../config/api";
import toast from 'react-hot-toast';
import { TokenVerificationService } from '../../utils/tokenVerification';
import { User, Mail, Lock, LogIn } from "lucide-react";
// Import reusable components
import AuthLayout from '../../components/auth/AuthLayout';
import AuthHeader from '../../components/auth/AuthHeader';
import SocialAuth from '../../components/auth/SocialAuth';
import InputField from '../../components/auth/InputField';
import ErrorMessage from '../../components/auth/ErrorMessage';
import AuthButton from '../../components/auth/AuthButton';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Handle OAuth token from URL parameters
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // Use the token verification service to handle OAuth tokens
    TokenVerificationService.handleOAuthToken(searchParams, navigate)
      .then(handled => {
        if (handled) {
          console.log('OAuth token handled successfully');
        }
      })
      .catch(error => {
        console.error('Error handling OAuth token:', error);
      });
  }, [location.search, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      console.log('🔍 Login response:', response);

      if (response.success) {
        toast.success('Login successful!');

        // Store auth token using the utility service
        if (response.token) {
          TokenVerificationService.storeAuthToken(response.token, {
            useLocalStorage: false, // Disabled for Claude.ai compatibility
            onTokenStored: (token) => {
              console.log('Auth token stored:', token);
            }
          });
        }

        // Navigate based on user role
        const userRole = response.user?.role;
        const hasProfile = response.user?.hasProfile;
        console.log("In login has profile:",hasProfile);
      if (userRole === 'admin') {
  navigate('/admin/dashboard');
} else if (!hasProfile) {
  // ✅ If profile not created yet, go to profile setup
  navigate('/app/create-profile', {
    state: {
      userData: response.user,
      fromLogin: true
    }
  });
} else {
  // ✅ Normal dashboard
  navigate('/app/dashboard');
}
      }
    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (error.response?.data) {
        const { message, requiresEmailVerification, email } = error.response.data;
        
        if (requiresEmailVerification) {
          errorMessage = 'Please verify your email before logging in.';
          toast.error(errorMessage);
          
          // Redirect to email verification page with email parameter
          const verificationUrl = `/verify-email?email=${encodeURIComponent(email || formData.email)}`;
          navigate(verificationUrl, {
            state: {
              email: email || formData.email,
              fromLogin: true,
              message: 'Please check your email and click the verification link to complete your account setup.'
            }
          });
          return;
        }
        
        errorMessage = message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
  window.location.href = `${API_BASE}/auth/google/login`;
};

  return (
    <AuthLayout>
      <AuthHeader
        title="Welcome Back!"
        subtitle="Sign in to manage your students"
        icon={<LogIn className="w-10 h-10 text-white" />}
      />

      <SocialAuth
        onGoogleAuth={handleGoogleLogin}
      />

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
          icon={<Mail className="w-5 h-5" />}
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          icon={<Lock className="w-5 h-5" />}
        />

        <AuthButton
          loading={loading}
          loadingText="Signing In..."
        >
          Sign In
        </AuthButton>
      </form>

      {/* Forgot Password Link */}
      <div className="mt-6 text-center">
        <Link
          to="/forgot-password"
          className="text-blue-400 hover:text-purple-400 text-sm transition duration-200"
        >
          Forgot your password?
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

export default Login;