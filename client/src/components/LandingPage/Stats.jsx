import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { number: "10K+", label: "Student Records Managed" },
  { number: "500+", label: "Institutions Onboarded" },
  { number: "99.9%", label: "Uptime" },
  { number: "24/7", label: "Operational Support" }
];

const Stats = () => {
  return (
    <motion.section
      className="max-w-6xl mx-auto px-6 py-10 md:py-14"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
        >
          <div className={`text-2xl md:text-3xl font-semibold tracking-tight ${index % 2 === 0 ? 'text-[#2563eb]' : 'text-[#c67a2a]'}`}>{stat.number}</div>
          <div className="mt-2 text-sm text-[#71717a] font-medium">{stat.label}</div>
        </motion.div>
      ))}
      </div>
    </motion.section>
  );
};

export default Stats;
