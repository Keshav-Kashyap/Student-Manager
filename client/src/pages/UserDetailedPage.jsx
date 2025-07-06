import React from 'react';
import { useParams } from 'react-router-dom';
import UserDetailsView from "../components/Admin/UserDetailsView";
import useAllUsers from '../Hooks/useAllUsers';
import SurajPrintingLoader from '../components/common/loader'

const UserDetailedPage = () => {
  const { id } = useParams(); // get user ID from URL
  const { users, error, loading } = useAllUsers();
  
  // 🔍 Debug logs - Check karo console mein
  console.log("=== DEBUG INFO ===");
  console.log("URL ID from useParams:", id);
  console.log("Users from hook:", users);
  console.log("Loading state:", loading);
  console.log("Error state:", error);
  console.log("Users length:", users?.length);
  
  // Agar users array hai toh IDs print karo
  if (users && users.length > 0) {
    console.log("All user IDs:", users.map(u => u.id));
    console.log("Looking for ID:", id);
  }

  if (error) {
    console.log("❌ Error occurred:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">❌</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Users</h3>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !users) {
    console.log("⏳ Loading state...");
    return (
      <SurajPrintingLoader title="Loading User Details..." subtitle="Please wait while we fetch the user information." />

    );
  }

  // User find karo
  const user = users.find((u) => u._id === id);
  console.log("🔍 Found user:", user);
  
  // Agar user nahi mila toh alternative methods try karo
  if (!user) {
    console.log("❌ User not found with _id, trying with id field...");
    const userById = users.find((u) => u.id === id);
    console.log("🔍 Found user with id field:", userById);
    
    if (userById) {
      return (
        <div>
          <UserDetailsView user={userById} />
        </div>
      );
    }
    
    // Still not found - show detailed error
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-yellow-600 text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">User Not Found</h3>
          <p className="text-gray-600 mb-4">No user found with ID: <code className="bg-gray-100 px-2 py-1 rounded">{id}</code></p>
          
          {/* Debug info */}
          <div className="bg-gray-50 p-4 rounded-lg text-left text-sm">
            <p><strong>Available User IDs:</strong></p>
            <ul className="mt-2 space-y-1">
              {users.slice(0, 5).map((u, index) => (
                <li key={index} className="font-mono text-xs bg-white px-2 py-1 rounded">
                  {u._id || u.id || 'No ID'}
                </li>
              ))}
              {users.length > 5 && <li className="text-gray-500">...and {users.length - 5} more</li>}
            </ul>
          </div>
          
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  console.log("✅ User found successfully, rendering UserDetailsView");
  return (
    <div>
      <UserDetailsView user={user} />
    </div>
  );
};

export default UserDetailedPage;