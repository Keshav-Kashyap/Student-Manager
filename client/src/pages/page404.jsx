import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigate = useNavigate();

  const [glitchText, setGlitchText] = useState('404');
  const [isAnimating, setIsAnimating] = useState(false);

  const glitchChars = ['4', '0', '4', '♦', '◊', '⧫', '▲', '●'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      const randomText = Array.from({length: 3}, () => 
        glitchChars[Math.floor(Math.random() * glitchChars.length)]
      ).join('');
      setGlitchText(randomText);
      
      setTimeout(() => {
        setGlitchText('404');
        setIsAnimating(false);
      }, 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleGoHome = () => {
    navigate('/');
    toast.success('Navigating to home page...')
  };

  const handleGoBack = () => {
     navigate(-1); 
    toast.success('Going back to previous page...');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 bg-white opacity-20 rotate-45 animate-bounce animation-delay-1000"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-300 opacity-30 animate-ping animation-delay-2000"></div>
        <div className="absolute bottom-32 left-16 w-2 h-2 bg-blue-300 opacity-40 rounded-full animate-pulse animation-delay-3000"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 border-2 border-white opacity-20 animate-spin animation-delay-500"></div>
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Glitch 404 Text */}
        <div className="mb-8">
          <h1 className={`text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-mono tracking-wider ${isAnimating ? 'animate-pulse' : ''}`}>
            {glitchText}
          </h1>
          <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full transform skew-x-12 animate-pulse"></div>
        </div>

        {/* Main Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in animation-delay-500">
            Oops! The page you're looking for seems to have vanished into the digital void. 
            Don't worry, even the best explorers sometimes take a wrong turn.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-1000">
          <button
            onClick={handleGoHome}
            className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <Home size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            Go Home
          </button>
          
          <button
            onClick={handleGoBack}
            className="group flex items-center gap-2 bg-transparent border-2 border-white/30 hover:border-white/60 text-white hover:bg-white/10 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Go Back
          </button>
          
          <button
            onClick={handleRefresh}
            className="group flex items-center gap-2 bg-transparent border-2 border-white/30 hover:border-white/60 text-white hover:bg-white/10 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            Refresh
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-8 animate-fade-in animation-delay-1500">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for something else..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-400 animate-fade-in animation-delay-2000">
          <p>Error Code: 404 | Page Not Found</p>
          <p className="mt-1">If you believe this is a mistake, please contact support.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}