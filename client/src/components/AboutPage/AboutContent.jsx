import React from 'react';
import { MapPin } from 'lucide-react';

const AboutContent = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Our Story & Mission
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Established with the blessings of Mata Rani, Suraj Printing Press has been serving 
              the community with high-quality printing services. We specialize in various types 
              of card printing and document services.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Located in the heart of Koharanwali Gali, Nirjhari (Purvi), we have built our 
              reputation on trust, quality, and timely delivery of services.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                <span>Koharanwali Gali, Nirjhari (Purvi)</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">जय माता दी</h3>
              <p className="text-purple-100 mb-6">
                With divine blessings, we continue to serve our customers with dedication and excellence.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Professional Service</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Quality Assurance</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Timely Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;