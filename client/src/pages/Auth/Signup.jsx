// pages/auth/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { API_BASE } from "../../config/api";
import toast from 'react-hot-toast';

// Import reusable components
import AuthLayout from '../../components/auth/AuthLayout';
import AuthHeader from '../../components/auth/AuthHeader';
import SocialAuth from '../../components/auth/SocialAuth';
import InputField from '../../components/auth/InputField';
import ErrorMessage from '../../components/auth/ErrorMessage';
import AuthButton from '../../components/auth/AuthButton';
import { User, Mail, Lock, Check, UserPlus } from "lucide-react";


const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register(
        formData.name, 
        formData.email, 
        formData.password
      );

      
      
      console.log('Registration response:', response);
      
      if (response.success) {
        // Show success message
        toast.success('Registration successful!');
        
        // Check if email verification is required
        if (response.requiresEmailVerification) {
          toast.success('Please check your email to verify your account');
          
          // Navigate to email verification page
          navigate('/verify-email', {
  state: {
    email: formData.email,
    userData: {
      name: formData.name,
      email: formData.email,
    },
    fromSignup: true,
    message: 'Please check your email and click the verification link to complete your registration.'
  },
  replace: true
});

        } else {
          // If no email verification needed, redirect to dashboard
          const userRole = response.user?.role;
          if (userRole === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/app/dashboard');
          }
        }
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
  window.location.href = `${API_BASE}/auth/google/signup`;
};

  return (

    <AuthLayout>

      <AuthHeader 
        title="Create Account"
        subtitle="Join our community of educators"
        icon={<UserPlus className="w-10 h-10 text-white" />}
      />

      <SocialAuth 
        onGoogleAuth={handleGoogleSignup}
      />

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Full Name"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
          icon={<User className="w-5 h-5" />}
        />

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
          placeholder="Create a password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          icon={<Lock className="w-5 h-5" />}
        />

        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={loading}
          icon={<Check className="w-5 h-5" />}
        />

        <AuthButton 
          loading={loading}
          loadingText="Creating Account..."
        >
          Create Account
        </AuthButton>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-300">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-blue-400 hover:text-purple-400 font-semibold transition duration-200"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;