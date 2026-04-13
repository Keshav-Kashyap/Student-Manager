import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <motion.footer
      className="mt-8 pb-10"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-[#171717] rounded-lg flex items-center justify-center">
              <GraduationCap size={18} className="text-[#f6f4ef]" />
            </div>
            <span className="text-[#171717] font-semibold select-none">Suraj Printing Press</span>
          </div>

          <div className="flex items-center gap-5 text-[#71717a] text-sm">
            <button className="hover:text-[#171717] transition-colors" onClick={() => navigate('/help')}>Privacy</button>
            <button className="hover:text-[#171717] transition-colors" onClick={() => navigate('/help')}>Terms</button>
            <button className="hover:text-[#171717] transition-colors" onClick={() => navigate('/help')}>Support</button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-[#71717a] text-sm">&copy; 2026 Suraj Printing Press. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;


