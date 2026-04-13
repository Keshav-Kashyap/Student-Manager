import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
    <motion.nav
      className="sticky top-0 z-[100] bg-[#f6f4ef]/95 backdrop-blur-sm"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('/')}>
          <div className="w-9 h-9 bg-[#171717] rounded-xl flex items-center justify-center">
            <GraduationCap size={20} className="text-[#f6f4ef]" />
          </div>
          <span className="text-lg md:text-xl font-semibold tracking-tight text-[#171717] select-none">Suraj Printing Press</span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/about')}
            className="px-4 py-2 text-[#3f3f46] hover:text-[#2563eb] transition-colors text-sm font-medium"
          >
            About
          </button>
          
          <button
            onClick={() => navigate('/help')}
            className="px-4 py-2 text-[#3f3f46] hover:text-[#c67a2a] transition-colors text-sm font-medium"
          >
            Help
          </button>

          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 bg-[#1d4ed8] text-[#f6f4ef] rounded-full text-sm font-medium hover:bg-[#1e40af] transition-colors"
          >
            Login
          </button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-[#1d4ed8] text-[#f6f4ef] rounded-full text-sm font-medium hover:bg-[#1e40af] transition-colors"
          >
            Login
          </button>
          
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-[#3f3f46] hover:text-[#171717] transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 bg-black/20 z-[90]"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />

            <motion.div
              className="md:hidden absolute top-full left-0 right-0 mx-4 mt-2 bg-[#f8f7f3] shadow-sm rounded-2xl overflow-hidden z-[95]"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div>
                <div className="flex justify-between items-center p-4">
                  <span className="text-[#171717] font-semibold text-base">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-[#52525b] hover:text-[#171717] transition-colors rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-col p-4 pt-0 space-y-1">
                  <button
                    onClick={() => handleNavigation('/about')}
                    className="px-4 py-3 text-[#3f3f46] hover:text-[#2563eb] transition-colors font-medium text-left hover:bg-[#efede7] rounded-xl"
                  >
                    About
                  </button>

                  <button
                    onClick={() => handleNavigation('/help')}
                    className="px-4 py-3 text-[#3f3f46] hover:text-[#c67a2a] transition-colors font-medium text-left hover:bg-[#efede7] rounded-xl"
                  >
                    Help
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;