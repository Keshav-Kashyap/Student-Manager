  import React from "react";

  const Logo = ({ user }) => {
    console.log(user);
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white rounded-xl font-bold text-xl select-none shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl">
          L
        </div>
        <div className="flex flex-col">
          <a
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent hover:from-indigo-800 hover:to-purple-800 transition-all duration-300"
          >
          Suraj Printing Press
          </a>
          <span className="text-sm text-gray-600 font-medium">
          {user?.role === 'admin' 
    ? 'Admin Dashboard' 
    : user?.collegeName || 'University'}
          </span>
        </div>
      </div>
    );
  };

  export default Logo;