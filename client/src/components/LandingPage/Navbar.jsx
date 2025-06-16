import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="relative z-10 p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white select-none">EduManage</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/about')}
            className="px-6 py-2 text-white hover:text-indigo-200 transition-colors font-medium"
          >
            About
          </button>
         
          <button
            onClick={() => navigate('/help')}
            className="px-6 py-2 text-white hover:text-indigo-200 transition-colors font-medium"
          >
            Help
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
