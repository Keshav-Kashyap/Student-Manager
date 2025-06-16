import React from 'react';
import { Users, Printer, BarChart3, Shield } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: "Student Management",
    description: "Easily manage student records, enrollment, and academic information in one place."
  },
  {
    icon: Printer,
    title: "ID Card Printing",
    description: "Generate and print professional student ID cards with customizable templates."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track student progress and institutional performance with detailed analytics."
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security to protect sensitive student and institutional data."
  }
];

const Features = () => {
  return (
    <div className="text-center mb-16 max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
      <p className="text-indigo-200 text-lg mb-12">Everything you need to manage your educational institution</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="group p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:shadow-indigo-500/25">
                <Icon size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-indigo-200 leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
