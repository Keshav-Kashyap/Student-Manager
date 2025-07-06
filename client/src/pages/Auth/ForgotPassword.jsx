// pages/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, KeyRound } from "lucide-react";

// Import reusable components
import AuthLayout from '../../components/auth/AuthLayout';
import AuthHeader from '../../components/auth/AuthHeader';
import InputField from '../../components/auth/InputField';
import ErrorMessage from '../../components/auth/ErrorMessage';
import AuthButton from '../../components/auth/AuthButton';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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
      const response = await authAPI.forgotPassword(formData.email);
      console.log('🔍 Forgot password response:', response);

      if (response.success) {
        setIsSuccess(true);
        toast.success('Check your email to reset password.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);

      let errorMessage = 'Failed to send reset email. Please try again.';

      if (error.response?.data) {
        const { message } = error.response.data;
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

  if (isSuccess) {
    return (
      <AuthLayout>
        <AuthHeader
          title="Check Your Email"
          subtitle="We've sent a password reset link to your email"
          icon={<Mail className="w-10 h-10 text-white" />}
        />

        <div className="text-center space-y-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              Email Sent Successfully!
            </h3>
            <p className="text-gray-300 text-sm">
              We've sent a password reset link to <strong>{formData.email}</strong>. 
              Please check your email and click the link to reset your password.
            </p>
          </div>

          <div className="text-sm text-gray-400">
            <p>Didn't receive the email? Check your spam folder or</p>
            <button
              onClick={() => setIsSuccess(false)}
              className="text-blue-400 hover:text-purple-400 transition duration-200"
            >
              try again
            </button>
          </div>
        </div>

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-blue-400 hover:text-purple-400 text-sm transition duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="Forgot Password?"
        subtitle="Enter your email to receive a password reset link"
        icon={<KeyRound className="w-10 h-10 text-white" />}
      />

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
          icon={<Mail className="w-5 h-5" />}
        />

        <AuthButton
          loading={loading}
          loadingText="Sending Reset Link..."
        >
          Send Reset Link
        </AuthButton>
      </form>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center text-blue-400 hover:text-purple-400 text-sm transition duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
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

export default ForgotPassword;