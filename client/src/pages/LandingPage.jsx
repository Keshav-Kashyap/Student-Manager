import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/LandingPage/Navbar';
import Hero from '../components/LandingPage/Hero';
import Stats from '../components/LandingPage/Stats';
import Features from '../components/LandingPage/Features';
import CTA from '../components/LandingPage/CTA';
import Footer from '../components/LandingPage/Footer';

const LandingPage = () => {
  return (
    <motion.div
      className="min-h-screen bg-[#f6f4ef] text-[#171717]"
      style={{ fontFamily: 'Inter, SF Pro Display, Segoe UI, Helvetica Neue, Arial, sans-serif' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-90px] right-[-50px] w-[320px] h-[320px] rounded-full bg-[#e9f0ff] opacity-65" />
        <div className="absolute bottom-[-120px] left-[-80px] w-[360px] h-[360px] rounded-full bg-[#f5ebdf] opacity-70" />
      </div>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <CTA />
      <Footer />
    </motion.div>
  );
};

export default LandingPage;