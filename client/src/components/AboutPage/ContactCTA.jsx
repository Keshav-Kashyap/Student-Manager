import React from 'react';

const ContactCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
          Contact us today for all your printing needs. We're here to help bring your ideas to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-colors">
            Call Now: 9761933967
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors">
            Visit Our Shop
          </button>
        </div>
        <div className="mt-8 text-purple-200">
          <p>📍 Main Chouraaha, Koharanwali Gali, Nirjhari (Purvi)</p>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;