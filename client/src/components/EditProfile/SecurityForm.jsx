import React from 'react';
import { Lock, AlertTriangle, Shield, Info } from 'lucide-react';
import FormInput from './FormInput';

const SecurityForm = ({ formData, onChange, isCreateMode = false }) => {
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
          Update your password to keep your account secure. Make sure to use a strong password.
        </p>
      </div>

      <FormInput
        label="Current Password"
        icon={Lock}
        type="password"
        name="currentPassword"
        value={formData.currentPassword}
        onChange={onChange}
        placeholder="Enter current password"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="New Password"
          icon={Lock}
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={onChange}
          placeholder="Enter new password"
          required
        />

        <FormInput
          label="Confirm Password"
          icon={Lock}
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
          placeholder="Confirm new password"
          required
        />
      </div>

      <PasswordRequirements />
    </div>
  );
};

const PasswordRequirements = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle size={18} className="text-yellow-600" />
        <h3 className="font-semibold text-yellow-800">Password Requirements:</h3>
      </div>
      <ul className="text-sm text-yellow-700 space-y-1 ml-6">
        <li>• At least 8 characters long</li>
        <li>• Contains uppercase and lowercase letters</li>
        <li>• Contains at least one number</li>
        <li>• Contains at least one special character (!@#$%^&*)</li>
        <li>• Should not contain your name or email</li>
      </ul>
    </div>
  );
};

export default SecurityForm;
