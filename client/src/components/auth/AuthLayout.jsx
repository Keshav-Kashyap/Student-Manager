// components/auth/AuthLayout.jsx
import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen md:h-screen bg-[#f6f4ef] relative overflow-y-auto md:overflow-hidden">

      <div className="relative z-10 md:h-full px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-6xl mx-auto md:h-full flex items-center">
          <div className="w-full md:h-full bg-white rounded-3xl shadow-[0_10px_30px_rgba(16,24,40,0.1)] border border-[#e8e5dd] overflow-hidden">
            <div className="h-full grid grid-cols-1 lg:grid-cols-[48%_52%]">
              <div className="h-full flex items-center justify-center px-5 py-6 md:px-6 md:py-5 lg:px-7">
                <div className="w-full max-w-md">
                  {children}
                </div>
              </div>

              <div className="h-full relative flex items-center justify-center ">
                <img
                  src="https://assets-v2.lottiefiles.com/a/165556e0-1170-11ee-ba69-cb0e26064da5/h0HNcpvJgv.gif"
                  alt="Students learning"
                  className=" h-150   w-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;