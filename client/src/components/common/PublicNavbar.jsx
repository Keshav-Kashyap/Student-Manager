import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, UserPlus, User } from 'lucide-react';

const PublicNavbar = ({ title = "Help Center" }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(savedUser));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();
    
    // Listen for storage changes (in case user logs out in another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleGoHome = () => {
    if (isLoggedIn) {
      navigate('/app/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Back Button */}
          <div className="flex items-center">
            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>
          </div>
          
          {/* Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          </div>

          {/* Right side - Login/Signup or User info */}
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200 font-medium"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </button>
                <button
                  onClick={handleSignup}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors duration-200 font-medium"
                >
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={20} className="text-gray-600" />
                  <span className="font-medium">
                    Welcome, {user?.name || 'User'}!
                  </span>
                </div>
                <button
                  onClick={handleGoHome}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                >
                  Go to Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;