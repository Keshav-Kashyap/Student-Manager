// UserTable.js - Fixed version
import React, { useState } from 'react';
import { Eye, Search, Building2, Download } from 'lucide-react';
import useAllUsers from '../../Hooks/useAllUsers';
import { useNavigate } from 'react-router-dom';
import SurajPrintingLoader from '../common/loader';


const UserTable = () => {
  const { users, loading, error } = useAllUsers();
  console.log("All users data:", users);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
   <SurajPrintingLoader title="Loading All Users..."  />

  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-red-500">Are You Really Admin ? Error loading users:  {error}</div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">User Management</h3>
            <p className="text-gray-600 mt-1">Manage all registered users and their students</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
           
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User Info</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">College</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Students</th>
          
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Join Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center overflow-hidden">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-lg">
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900 font-medium">{user.collegeName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">{user.phone || 'N/A'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-lg font-bold text-blue-600">
                    {user.students?.length || user.studentsCount || 0}
                  </span>
                </td>
              
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.joinDate || user.createdAt 
                    ? new Date(user.joinDate || user.createdAt).toLocaleDateString('en-IN')
                    : 'N/A'
                  }
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      console.log("Navigating to user:", user.id);
                      navigate(`/admin/users/${user.id}`); // Use _id instead of id
                    }}
                    className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;