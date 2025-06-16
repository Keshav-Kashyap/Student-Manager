import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle } from 'lucide-react';

const CTA = () => {
  return (
    <div className="text-center max-w-2xl mx-auto p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl mb-16">
      <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
      <p className="text-indigo-200 mb-8">Join thousands of educational institutions already using EduManage</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/signup"
          className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Users size={20} />
          Sign Up
        </Link>

        <Link
          to="/login"
          className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold text-lg border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
        >
          Login
        </Link>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6 text-indigo-200">
        <CheckCircle size={16} />
        <span className="text-sm">Free 30-day trial • No credit card required</span>
      </div>
    </div>
  );
};

export default CTA;
