import React, { useState } from 'react';
import { Lock, AlertTriangle, Shield, Info, Mail, KeyRound, CheckCircle } from 'lucide-react';
import { authAPI } from '../../services/api'; // Adjust path as needed
import toast from 'react-hot-toast';

const SecurityForm = ({ formData, onChange, isCreateMode = false, userEmail }) => {
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handlePasswordReset = async () => {
    if (!userEmail) {
      toast.error('Email not found. Please refresh the page.');
      return;
    }

    setResetLoading(true);
    
    try {
      const response = await authAPI.forgotPassword(userEmail);
      
      if (response.success) {
        setResetSent(true);
        toast.success('Password reset link sent to your email!');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Failed to send reset email. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setResetLoading(false);
    }
  };

  if (isCreateMode) {
    // For create mode, show info message instead of password change
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <Info size={48} className="text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Security Settings</h3>
          <p className="text-blue-700 mb-4">
            Your account password was set during signup. You can change it later from your profile settings.
          </p>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-600">
              <strong>Account Security:</strong> Your password is encrypted and secure. 
              You can update security settings anytime after completing your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={18} className="text-blue-600" />
          <h3 className="font-semibold text-blue-800">Security Settings</h3>
        </div>
        <p className="text-sm text-blue-700">
          Keep your account secure by updating your password when needed.
        </p>
      </div>

      {/* Password Reset Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <KeyRound size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Password Management</h3>
            <p className="text-sm text-gray-600">Reset your password securely via email</p>
          </div>
        </div>

        {resetSent ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={18} className="text-green-600" />
              <h4 className="font-semibold text-green-800">Reset Link Sent!</h4>
            </div>
            <p className="text-sm text-green-700 mb-3">
              We've sent a password reset link to <strong>{userEmail}</strong>
            </p>
            <p className="text-xs text-green-600">
              Check your email and click the link to reset your password. The link will expire in 1 hour.
            </p>
            <button
              onClick={() => setResetSent(false)}
              className="mt-3 text-sm text-green-600 hover:text-green-700 underline"
            >
              Send another reset link
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Current Email:</span>
              </div>
              <p className="text-sm text-gray-600 ml-6">{userEmail}</p>
            </div>

            <button
              onClick={handlePasswordReset}
              disabled={resetLoading}
              className={`w-full px-4 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                resetLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'
              }`}
            >
              {resetLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Reset Link...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Mail size={18} />
                  <span>Send Password Reset Link</span>
                </div>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              You'll receive an email with a secure link to reset your password
            </p>
          </div>
        )}
      </div>

      <SecurityTips />
    </div>
  );
};

const SecurityTips = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle size={18} className="text-yellow-600" />
        <h3 className="font-semibold text-yellow-800">Security Tips:</h3>
      </div>
      <ul className="text-sm text-yellow-700 space-y-1 ml-6">
        <li>• Use a strong, unique password for this account</li>
        <li>• Don't share your password with anyone</li>
        <li>• Reset your password if you suspect it's compromised</li>
        <li>• Always log out from shared or public devices</li>
        <li>• Check your email regularly for security notifications</li>
      </ul>
    </div>
  );
};

export default SecurityForm;