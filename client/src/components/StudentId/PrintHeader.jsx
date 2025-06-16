import React from 'react';
import { Printer, Download, RefreshCw } from 'lucide-react';

const PrintHeader = ({
  studentsToPrint,
  selectedStudents,
  loading,
  onRefresh,
  onPrint,
  onExportPDF
}) => {
  return (
    <div className="print:hidden bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student ID Cards - Print Preview
            </h1>
            <p className="text-gray-600">
              {studentsToPrint.length} card(s) ready to print
              {selectedStudents.length > 0 && ` (${selectedStudents.length} selected)`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>

            <button
              onClick={onExportPDF}
              className="flex items-center gap-2 px-4 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <Download size={18} />
              Export PDF
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              disabled={studentsToPrint.length === 0}
            >
              <Printer size={18} />
              Print Cards ({studentsToPrint.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintHeader;