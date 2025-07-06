import React from 'react';
export const getColorClasses = (color, shade = 500) => {
  const colorMap = {
    gray: {
      200: "bg-gradient-to-br from-gray-200 to-gray-300",
      500: "bg-gradient-to-br from-gray-500 to-gray-600"
    },
    blue: {
      200: "bg-gradient-to-br from-blue-200 to-blue-300",
      500: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    red: {
      200: "bg-gradient-to-br from-red-200 to-red-300",
      500: "bg-gradient-to-br from-red-500 to-red-600"
    },
    green: {
      200: "bg-gradient-to-br from-green-200 to-green-300",
      500: "bg-gradient-to-br from-green-500 to-green-600"
    },
    purple: {
      200: "bg-gradient-to-br from-purple-200 to-purple-300",
      500: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    indigo: {
      200: "bg-gradient-to-br from-indigo-200 to-indigo-300",
      500: "bg-gradient-to-br from-indigo-500 to-indigo-600"
    },
    pink: {
      200: "bg-gradient-to-br from-pink-200 to-pink-300",
      500: "bg-gradient-to-br from-pink-500 to-pink-600"
    },
    yellow: {
      200: "bg-gradient-to-br from-yellow-200 to-yellow-300",
      500: "bg-gradient-to-br from-yellow-500 to-yellow-600"
    },
    orange: {
      200: "bg-gradient-to-br from-orange-200 to-orange-300",
      500: "bg-gradient-to-br from-orange-500 to-orange-600"
    },
    teal: {
      200: "bg-gradient-to-br from-teal-200 to-teal-300",
      500: "bg-gradient-to-br from-teal-500 to-teal-600"
    },
    cyan: {
      200: "bg-gradient-to-br from-cyan-200 to-cyan-300",
      500: "bg-gradient-to-br from-cyan-500 to-cyan-600"
    },
    emerald: {
      200: "bg-gradient-to-br from-emerald-200 to-emerald-300",
      500: "bg-gradient-to-br from-emerald-500 to-emerald-600"
    },
    violet: {
      200: "bg-gradient-to-br from-violet-200 to-violet-300",
      500: "bg-gradient-to-br from-violet-500 to-violet-600"
    },
    fuchsia: {
      200: "bg-gradient-to-br from-fuchsia-200 to-fuchsia-300",
      500: "bg-gradient-to-br from-fuchsia-500 to-fuchsia-600"
    },
    rose: {
      200: "bg-gradient-to-br from-rose-200 to-rose-300",
      500: "bg-gradient-to-br from-rose-500 to-rose-600"
    }
  };

  return colorMap[color]?.[shade] || colorMap.blue[shade] || colorMap.blue[500];
};