import React from 'react';

const AuthHeader = ({ title, subtitle, icon }) => {
  return (
    <div className="text-center mb-5">
      <div className="mx-auto w-16 h-16 bg-[#eef3ff] rounded-2xl flex items-center justify-center mb-4 border border-[#dbe8ff]">
        {icon}
      </div>
      <h2 className="text-3xl md:text-[34px] font-bold text-[#171717] tracking-tight mb-1.5 leading-tight">
        {title}
      </h2>
      <p className="text-[#71717a] text-sm md:text-[15px]">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;