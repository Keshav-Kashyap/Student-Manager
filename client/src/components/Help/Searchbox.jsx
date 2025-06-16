    import React from 'react';
import { Search } from 'lucide-react';

const SearchBox = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="अपना सवाल यहाँ टाइप करें... (जैसे: account कैसे बनाएं)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg text-lg focus:border-indigo-500 focus:outline-none transition-colors"
        />
      </div>
    </div>
  );
};

export default SearchBox;