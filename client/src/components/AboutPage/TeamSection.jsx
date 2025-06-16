import React from 'react';
import { Phone } from 'lucide-react';

const TeamSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Team</h2>
          <p className="text-xl text-gray-600">Meet the people behind our success</p>
        </div>
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">SP</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Suraj Prakash</h3>
              <p className="text-purple-600 font-semibold mb-3">Organizer & Founder</p>
              <p className="text-gray-600 mb-4">
                Leading the printing industry with dedication and expertise for years
              </p>
              <div className="flex items-center justify-center text-gray-700">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">9761933967</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;