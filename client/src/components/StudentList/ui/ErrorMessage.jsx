import React from 'react';

const ErrorMessage = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;