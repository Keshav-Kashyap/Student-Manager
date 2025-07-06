// AdminNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';


const AdminNav = ({ activeTab, setActiveTab, setViewMode }) => {

const location = useLocation();
  
return (

  <nav className="bg-white shadow-lg">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex space-x-8">
       <Link to="/admin/dashboard">
  <button
    className={`py-4 px-4 border-b-3 font-semibold text-sm transition-all ${
      location.pathname === '/admin/dashboard'
        ? 'border-blue-500 text-blue-600 bg-blue-50'
        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
    } rounded-t-lg`}
  >
    Dashboard
  </button>
</Link>
      <Link to="/admin/users">
  <button
    className={`py-4 px-4 border-b-3 font-semibold text-sm transition-all ${
      location.pathname === '/admin/users'
        ? 'border-blue-500 text-blue-600 bg-blue-50'
        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
    } rounded-t-lg`}
  >
    User Management
  </button>
</Link>

        <button
          onClick={() => setActiveTab('requests')}
          className={`py-4 px-4 border-b-3 font-semibold text-sm transition-all ${
            activeTab === 'requests'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          } rounded-t-lg`}
        >
          ID Card Requests
        </button> 
      </div>
    </div>
  </nav>
);
};

export default AdminNav;