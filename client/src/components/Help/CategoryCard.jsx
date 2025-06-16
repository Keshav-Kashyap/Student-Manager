import React from 'react';
import { HelpCircle } from 'lucide-react';

const CategoryCard = ({ category }) => {
  const IconComponent = category.icon;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
          <IconComponent size={24} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-indigo-900">{category.title}</h3>
      </div>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{category.description}</p>
      <ul className="space-y-2">
        {category.links.map((link, linkIndex) => (
          <li key={linkIndex}>
            <button className="text-indigo-600 hover:text-indigo-800 transition-colors text-left hover:underline flex items-center gap-2 text-sm group">
              <HelpCircle size={14} className="text-indigo-400 group-hover:text-indigo-600" />
              {link}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryCard;