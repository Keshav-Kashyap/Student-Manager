import React from 'react';

const stats = [
  { number: "10K+", label: "Students Managed" },
  { number: "500+", label: "Schools Trust Us" },
  { number: "99.9%", label: "Uptime" },
  { number: "24/7", label: "Support" }
];

const Stats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 text-center max-w-7xl mx-auto px-6">
      {stats.map((stat, index) => (
        <div key={index}>
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
          <div className="text-indigo-200 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
