import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = ({ faqs, openFAQ, toggleFAQ }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center flex items-center justify-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <HelpCircle size={20} className="text-white" />
        </div>
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-100 rounded-lg p-4 hover:border-indigo-200 transition-colors">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left hover:text-indigo-600 transition-colors"
            >
              <span className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                <HelpCircle size={18} className="text-indigo-400" />
                {faq.question}
              </span>
              <div className="ml-4 flex-shrink-0">
                {openFAQ === index ? 
                  <ChevronUp size={20} className="text-indigo-600" /> : 
                  <ChevronDown size={20} className="text-gray-400" />
                }
              </div>
            </button>
            {openFAQ === index && (
              <div className="mt-4 text-gray-600 leading-relaxed ml-9 animate-in slide-in-from-top duration-200">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;