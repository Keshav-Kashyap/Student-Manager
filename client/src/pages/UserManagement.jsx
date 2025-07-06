import React, { useState } from 'react';
import UserTable from '../components/Admin/UserTable';
import UserDetailsView from '../components/Admin/UserDetailsView';

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {viewMode === 'list' ? (
        <UserTable setSelectedUser={setSelectedUser} setViewMode={setViewMode} />
      ) : (
        <UserDetailsView user={selectedUser} />
      )}
    </div>
  );
};

export default UserManagement;
