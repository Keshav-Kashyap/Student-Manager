import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LifeBuoy,
  User,
  Phone,
  Mail,
  Smartphone,
  HelpCircle
} from 'lucide-react';

import PublicNavbar from '../components/common/PublicNavbar';
import FAQSection from '../components/help/FAQSection';
import ContactOption from '../components/help/ContactOption';

// Main Help Center Component
const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  const location = useLocation();
  
  // Check if user is in app layout (logged in)
  const isInAppLayout = location.pathname.startsWith('/app');

  // Check login status
  useEffect(() => {
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(savedUser));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();
    
    // Listen for storage changes (in case user logs out in another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const contactOptions = [
    {
      title: "Phone Support",
      description: "24/7 phone support",
      icon: Phone,
      action: "Call Now",
      onClick: () => {
        window.open("tel:+919761933967");
      }
    },
    {
      title: "Email Support",
      description: "24 घंटे में reply",
      icon: Mail,
      action: "Send Email",
      onClick: () => {
        window.open("mailto:support@example.com");
      }
    },
    {
      title: "Mobile Support",
      description: "Mobile app के लिए",
      icon: Smartphone,
      action: "Get App",
      onClick: () => {
        toast.error("Mobile App launching soon!");
      }
    }
  ];

  const faqs = [
    {
      question: "क्या यह service बिल्कुल free है?",
      answer: "हाँ, हमारी basic services बिल्कुल free हैं। Premium features के लिए affordable plans भी available हैं।"
    },
    {
      question: "अगर technical problem हो तो कितनी देर में response मिलेगा?",
      answer: "हम 24 घंटे के अंदर respond करने की कोशिश करते हैं। Urgent issues के लिए live chat भी available है।"
    },
    {
      question: "Mobile app कब launch होगा?",
      answer: "हमारा mobile app currently development में है और जल्द ही launch होगा। Updates के लिए newsletter subscribe करें।"
    },
    {
      question: "Data security कैसे ensure करते हैं?",
      answer: "हम industry-standard encryption और security protocols use करते हैं। आपका data completely safe है।"
    },
    {
      question: "Account कैसे बनाएं?",
      answer: "बहुत आसान! बस Sign Up पर click करें, अपनी details भरें, email verify करें और आप ready हैं।"
    },
    {
      question: "Password reset कैसे करें?",
      answer: "Login page पर 'Forgot Password' link पर click करें, email address डालें और instructions follow करें।"
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className={`min-h-screen ${isInAppLayout ? 'bg-gray-50' : 'bg-blue-50'}`}>
      {/* Header for non-app layout - using reusable PublicNavbar */}
      {!isInAppLayout && <PublicNavbar title="Help Center" />}

      {/* Main Content */}
      <div className={`${isInAppLayout ? 'px-6 py-6' : 'px-6 pb-20 pt-10'} ${!isInAppLayout ? 'max-w-7xl mx-auto' : ''}`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <LifeBuoy size={28} className="text-white" />
            </div>
            Help Center
          </h1>
          <p className="text-indigo-700 text-lg">
            {isLoggedIn 
              ? `Welcome ${user?.name || 'User'}! हम यहाँ आपकी सहायता के लिए हैं`
              : 'हम यहाँ आपकी सहायता के लिए हैं - आपके सभी सवालों के जवाब यहाँ मिलेंगे'
            }
          </p>
        </div>

        {/* User Status Banner */}
        {isLoggedIn && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-green-800 font-medium">You're logged in!</p>
                <p className="text-green-600 text-sm">
                  You have access to all premium features and personalized support.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <HelpCircle size={16} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-yellow-800 font-medium">Get more personalized help</p>
                <p className="text-yellow-600 text-sm">
                  Login to access premium support and save your preferences.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <FAQSection faqs={faqs} openFAQ={openFAQ} toggleFAQ={toggleFAQ} />

        {/* Contact Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Phone size={20} className="text-white" />
            </div>
            Still Need Help?
          </h2>
          <p className="text-center text-gray-600 mb-6">
            {isLoggedIn 
              ? `${user?.name || 'User'}, हमारी team से direct contact करें`
              : 'हमारी team से direct contact करें'
            }
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => (
              <ContactOption key={index} option={option} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer for non-app layout */}
      {!isInAppLayout && (
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500">
              <p>&copy; 2024 Your App Name. All rights reserved.</p>
              <div className="mt-4 flex justify-center gap-6">
                <button
                  onClick={() => navigate('/about')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => navigate('/help')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Help
                </button>
                <button
                  onClick={() => toast.info('Contact page coming soon!')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default HelpCenter;