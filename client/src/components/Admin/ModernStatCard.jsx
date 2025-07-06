// ModernStatCard.jsx
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { getColorClasses } from './utils/getColorClasses';

const ModernStatCard = ({ title, value, icon: Icon, trend, color = "blue", subtitle }) => (
  <div className={`${getColorClasses(color, 500)} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
        <Icon className="w-8 h-8" />
      </div>
      {trend && (
        <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="text-sm font-semibold">+{trend}%</span>
        </div>
      )}
    </div>
    <h3 className="text-3xl font-bold mb-1">{value}</h3>
    <p className="text-sm opacity-90 font-medium">{title}</p>
    {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
  </div>
);

export default ModernStatCard;