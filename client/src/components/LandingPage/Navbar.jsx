import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, LogIn, Info, HelpCircle } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <nav className="relative z-[100] p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white select-none">Suraj Printing Press</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
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

          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <LogIn size={18} />
            Login
          </button>
        </div>

        {/* Mobile Menu - Login Button and Hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <LogIn size={16} />
            Login
          </button>
          
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-white hover:text-indigo-200 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Modern Glassmorphism Design */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div 
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="md:hidden absolute top-full left-0 right-0 mx-4 mt-2 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden z-[95]">
            <div className="bg-gradient-to-br from-white/5 to-transparent">
              {/* Header with Close Button */}
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <span className="text-white font-semibold text-lg">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white hover:text-red-300 transition-colors hover:bg-white/10 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Menu Items */}
              <div className="flex flex-col p-4 space-y-2">
                <button
                  onClick={() => handleNavigation('/about')}
                  className="px-6 py-4 text-white hover:text-indigo-200 transition-all duration-300 font-medium text-left hover:bg-white/10 rounded-xl backdrop-blur-sm border border-transparent hover:border-white/20 flex items-center gap-3"
                >
                  <Info size={20} className="text-indigo-300" />
                  About
                </button>
                
                <button
                  onClick={() => handleNavigation('/help')}
                  className="px-6 py-4 text-white hover:text-indigo-200 transition-all duration-300 font-medium text-left hover:bg-white/10 rounded-xl backdrop-blur-sm border border-transparent hover:border-white/20 flex items-center gap-3"
                >
                  <HelpCircle size={20} className="text-indigo-300" />
                  Help
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;