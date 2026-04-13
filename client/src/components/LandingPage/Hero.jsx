import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.section
      className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-20 md:pb-24 text-center"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#171717] leading-[1.08] max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      >
        Run your institution with <span className="text-[#2563eb]">clarity</span>, <span className="text-[#c67a2a]">confidence</span>, and calm.
      </motion.h1>

      <motion.p
        className="mt-6 text-base sm:text-lg text-[#52525b] max-w-2xl mx-auto leading-relaxed font-light"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      >
        A focused student management platform for admissions, profiles, ID card workflows, and everyday administration.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.28, ease: 'easeOut' }}
      >
        <Link
          to="/signup"
          className="group px-7 py-3.5 bg-[#1d4ed8] text-[#f6f4ef] rounded-full text-sm font-medium hover:bg-[#1e40af] transition-colors flex items-center gap-2"
        >
          Start Free Trial
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          to="/about"
          className="px-7 py-3.5 bg-[#f2e8db] text-[#80501f] rounded-full text-sm font-medium hover:bg-[#eadcc9] transition-colors"
        >
          Explore Platform
        </Link>
      </motion.div>

      <div className="mt-14 md:mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <motion.div
          className="bg-[#fbfaf7] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: 0.12 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#2563eb]">Onboarding</p>
          <p className="mt-3 text-[#27272a] text-sm leading-relaxed">Set up your institution profile and student records in minutes with guided flows.</p>
        </motion.div>
        <motion.div
          className="bg-[#fbfaf7] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#c67a2a]">Daily Ops</p>
          <p className="mt-3 text-[#27272a] text-sm leading-relaxed">Handle student updates, attendance information, and verification from one workspace.</p>
        </motion.div>
        <motion.div
          className="bg-[#fbfaf7] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: 0.24 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#2563eb]">Identity</p>
          <p className="mt-3 text-[#27272a] text-sm leading-relaxed">Print clean, consistent ID cards with configurable details and approved templates.</p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
