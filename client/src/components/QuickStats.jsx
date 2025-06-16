// components/QuickStats.jsx
import React from "react";

const QuickStats = () => {
  return (
    <div className="mt-8">
      <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-full translate-y-8 -translate-x-8" />

        <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-blue-100">Total Students</span>
              <span className="font-bold text-white">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-100">ID Cards Printed</span>
              <span className="font-bold text-white">892</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-100">Active Today</span>
              <span className="font-bold text-white">34</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
