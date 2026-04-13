import React from 'react';
import { Users, Printer, BarChart3, Shield, Clock, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Users,
    title: "Student Management",
    description: "Maintain complete student profiles, enrollment status, and academic records in one clean system."
  },
  {
    icon: Printer,
    title: "ID Card Workflows",
    description: "Generate polished ID cards with approved templates and consistent institutional formatting."
  },
  {
    icon: BarChart3,
    title: "Performance Insights",
    description: "Monitor trends in attendance, updates, and operations through easy-to-read metrics."
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Protect sensitive student information with role-aware access and trusted security practices."
  },
  {
    icon: Clock,
    title: "Fast Daily Operations",
    description: "Reduce administrative overhead with workflows tuned for repetitive day-to-day tasks."
  },
  {
    icon: Fingerprint,
    title: "Reliable Access Control",
    description: "Keep every activity accountable with permission-aware controls across the platform."
  }
];

const Features = () => {
  return (
    <motion.section
      className="max-w-6xl mx-auto px-6 py-14 md:py-20"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#2563eb]">Capabilities</p>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-[#171717]">Everything needed for modern administration</h2>
        <p className="mt-4 text-[#52525b] text-base md:text-lg max-w-2xl mx-auto font-light">Built for institutions that care about accuracy, trust, and day-to-day operational clarity.</p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isBlueAccent = index % 2 === 0;
          return (
            <motion.div
              key={index}
              className="group p-7 bg-[#fbfaf7] rounded-2xl shadow-[0_1px_3px_rgba(16,24,40,0.06)] hover:shadow-[0_4px_14px_rgba(16,24,40,0.08)] transition-shadow duration-200 text-left"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.38, delay: index * 0.06, ease: 'easeOut' }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${isBlueAccent ? 'bg-[#e9f0ff]' : 'bg-[#f5ebdf]'}`}>
                <Icon size={20} className={isBlueAccent ? 'text-[#2563eb]' : 'text-[#c67a2a]'} />
              </div>
              <h3 className="text-lg font-semibold text-[#171717] tracking-tight">{feature.title}</h3>
              <p className="mt-3 text-[#52525b] leading-relaxed text-sm md:text-base font-light">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default Features;
