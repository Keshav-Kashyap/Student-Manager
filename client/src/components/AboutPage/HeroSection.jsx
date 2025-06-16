import React from 'react';
import { Phone } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-[#f9fafb] text-blue-800 py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          About Suraj Printing Press
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          जय माता दी - Your trusted partner for all printing solutions since decades
        </p>
        <div className="inline-flex items-center bg-blue-100 rounded-full px-6 py-3">
          <Phone className="w-5 h-5 mr-2 text-blue-600" />
          <span className="font-semibold">Mobile: 9761933967</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
