import React from 'react';
import { Award, Users, Shield, Clock } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { number: "10K+", label: "Cards Printed", icon: Award },
    { number: "500+", label: "Happy Customers", icon: Users },
    { number: "99.9%", label: "Quality Rate", icon: Shield },
    { number: "24/7", label: "Service Support", icon: Clock }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;