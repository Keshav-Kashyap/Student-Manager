
import React from 'react';
import { getColorClasses } from './utils/getColorClasses';
 
export const ModernStatCardSkeleton = ({ color = "gray" }) => (
  <div className={`${getColorClasses(color, 200)} rounded-2xl p-6 shadow-xl animate-pulse`}>
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30">
        <div className="w-8 h-8 bg-white/30 rounded"></div>
      </div>
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white/30 rounded mr-1"></div>
          <div className="w-8 h-4 bg-white/30 rounded"></div>
        </div>
      </div>
    </div>
    <div className="w-24 h-9 bg-white/30 rounded mb-1"></div>
    <div className="w-32 h-4 bg-white/25 rounded mb-1"></div>
    <div className="w-20 h-3 bg-white/20 rounded mt-1"></div>
  </div>
);