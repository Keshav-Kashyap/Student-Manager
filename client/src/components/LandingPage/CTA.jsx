import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <motion.section
      className="max-w-5xl mx-auto px-6 py-16 md:py-20"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.div
        className="text-center bg-[#f1eee7] rounded-3xl p-8 md:p-12 shadow-[0_2px_8px_rgba(16,24,40,0.05)]"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-[#171717]">Build trust with every student record.</h3>
        <p className="mt-4 text-[#52525b] max-w-2xl mx-auto leading-relaxed font-light">Start with a focused setup and move your administrative workflows into a cleaner, faster platform.</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
          <Link
            to="/signup"
            className="group px-7 py-3.5 bg-[#1d4ed8] text-[#f6f4ef] rounded-full text-sm font-medium hover:bg-[#1e40af] transition-colors inline-flex items-center justify-center gap-2"
          >
            Create Account
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          </motion.div>

          <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
          <Link
            to="/login"
            className="px-7 py-3.5 bg-[#f2e8db] text-[#80501f] rounded-full text-sm font-medium hover:bg-[#eadcc9] transition-colors inline-flex items-center justify-center"
          >
            Login
          </Link>
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-[#2563eb]">
          <CheckCircle2 size={16} />
          <span className="text-sm">No setup complexity • Onboarding support included</span>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default CTA;
