import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative z-10 border-t border-white/20 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="text-white font-semibold select-none">Suraj Printing Press</span>
          </div>

          <div className="flex items-center gap-6 text-indigo-200">
            <button className="hover:text-white transition-colors" onClick={() => navigate('/help')}>Privacy</button>
            <button className="hover:text-white transition-colors" onClick={() => navigate('/help')}>Terms</button>
            <button className="hover:text-white transition-colors" onClick={() => navigate('/help')}>Support</button>
          </div>
        </div>

        <div className="text-center mt-6 pt-6 border-t border-white/10">
          <p className="text-indigo-200">&copy; 2025 Suraj Printing Press. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


