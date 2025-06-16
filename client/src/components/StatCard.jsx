// components/StatCard.jsx
import React from "react";

const StatCard = ({ title, value, Icon }) => {
  return (
    <div 
      className="bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-xl p-6 text-white relative overflow-hidden border border-white/30 shadow-2xl backdrop-blur-lg transition-all duration-300 ease-out hover:scale-105 hover:shadow-3xl hover:shadow-purple-500/20 hover:-translate-y-1 cursor-pointer group"
    >
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10 blur-sm transition-all duration-500 group-hover:scale-125 group-hover:bg-white/25"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/20 rounded-full translate-y-8 -translate-x-8 blur-sm transition-all duration-500 group-hover:scale-115 group-hover:bg-white/25"></div>
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-600 group-hover:scale-105 group-hover:bg-white/10"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30">
        <div className="mb-4 p-3 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300 group-hover:bg-white/25">
          <Icon size={32} className="text-white drop-shadow-lg" />
        </div>
        <h2 className="text-xl font-semibold mb-1">{title}</h2>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
