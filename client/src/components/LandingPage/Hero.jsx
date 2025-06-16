import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
      <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
        Manage Your
        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent block">
          Educational
        </span>
        Institution
      </h1>

      <p className="text-xl text-indigo-100 mb-12 max-w-3xl mx-auto leading-relaxed">
        Streamline student management, generate ID cards, and track academic progress with our comprehensive educational management platform.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
        <Link
          to="/signup"
          className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          Get Started Free
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <button
          onClick={() => toast.error('Demo coming soon!')}
          className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          Watch Demo
        </button>
      </div>
    </div>
  );
};

export default Hero;
