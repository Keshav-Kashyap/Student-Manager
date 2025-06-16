import React from 'react';

const PrintStyles = () => (
  <style jsx>{`
    @media print {
      @page {
        margin: 0.5in;
        size: A4;
      }
      
      body {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      
      .print\\:bg-gray-800 {
        background-color: #1f2937 !important;
      }
      
      .print\\:bg-gray-200 {
        background-color: #e5e7eb !important;
      }
      
      .print\\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      
      .print\\:grid-cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }
      
      .print\\:grid-cols-4 {
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      }
    }

    @media screen and (max-width: 640px) {
      .grid {
        justify-items: center;
      }
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `}</style>
);

export default PrintStyles;