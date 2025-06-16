import React from 'react';

const UserProfileCard = ({ user }) => {
  if (!user) return null;

  const profileFields = [
    { label: 'Name', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Phone', value: user.phone },
    { label: 'College', value: user.collegeName },
    { label: 'Department', value: user.department },
    { label: 'Designation', value: user.designation }
  ];

  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profileFields.map((field, index) => (
          <div key={index}>
            <p className="text-sm text-gray-600">{field.label}</p>
            <p className="font-medium text-gray-800">{field.value || 'Not provided'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfileCard;