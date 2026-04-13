import React from 'react';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange && onPageChange(currentPage - 1)}
        disabled={!canGoPrev || !onPageChange}
        className="px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <div className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">
        {currentPage} / {totalPages}
      </div>
      <button
        onClick={() => onPageChange && onPageChange(currentPage + 1)}
        disabled={!canGoNext || !onPageChange}
        className="px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;