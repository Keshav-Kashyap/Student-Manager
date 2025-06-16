// pages/StudentIDPrintPage.jsx
import React, { useState, useEffect } from 'react';
import { RefreshCw, Printer, FileText, BarChart3 } from 'lucide-react';
import LoadingSpinner from '../components/studentList/ui/LoadingSpinner';
import ErrorMessage from '../components/studentList/ui/ErrorMessage';
import useStudents from '../hooks/useStudent';
import PrintHeader from '../components/studentId/PrintHeader';
import StudentSelector from '../components/studentId/StudentSelector';
import IDCardGrid from '../components/studentId/IDCardGrid';
import PrintStyles from '../components/studentId/PrintStyles';
import toast from 'react-hot-toast';
import { handleDeleteStudent } from '../handlers/studentHandlers';

// Print Statistics Service
const PrintStatsService = {
  // Get all print statistics
  getStats: () => {
    const stats = localStorage.getItem('printStats');
    return stats ? JSON.parse(stats) : {
      totalPrints: 0,
      todayPrints: 0,
      thisWeekPrints: 0,
      thisMonthPrints: 0,
      lastPrintDate: null,
      printHistory: []
    };
  },

  // Update print statistics
  updateStats: (printedCount) => {
    const now = new Date();
    const today = now.toDateString();
    const currentStats = PrintStatsService.getStats();
    
    // Calculate week and month boundaries
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Reset daily count if new day
    if (currentStats.lastPrintDate !== today) {
      currentStats.todayPrints = 0;
      
      // Reset weekly count if new week
      const lastPrintDate = new Date(currentStats.lastPrintDate);
      if (lastPrintDate < startOfWeek) {
        currentStats.thisWeekPrints = 0;
      }
      
      // Reset monthly count if new month
      if (lastPrintDate < startOfMonth) {
        currentStats.thisMonthPrints = 0;
      }
    }
    
    // Update counts
    const updatedStats = {
      totalPrints: currentStats.totalPrints + printedCount,
      todayPrints: currentStats.todayPrints + printedCount,
      thisWeekPrints: currentStats.thisWeekPrints + printedCount,
      thisMonthPrints: currentStats.thisMonthPrints + printedCount,
      lastPrintDate: today,
      printHistory: [
        ...currentStats.printHistory,
        {
          date: now.toISOString(),
          count: printedCount,
          timestamp: now.getTime()
        }
      ].slice(-50) // Keep only last 50 print records
    };
    
    localStorage.setItem('printStats', JSON.stringify(updatedStats));
    return updatedStats;
  },

  // Clear all statistics (for reset functionality)
  clearStats: () => {
    localStorage.removeItem('printStats');
  },

  // Get formatted stats for display
  getFormattedStats: () => {
    const stats = PrintStatsService.getStats();
    return {
      total: stats.totalPrints,
      today: stats.todayPrints,
      week: stats.thisWeekPrints,
      month: stats.thisMonthPrints,
      lastPrint: stats.lastPrintDate ? new Date(stats.lastPrintDate).toLocaleDateString() : 'Never'
    };
  }
};

// Print Statistics Component
const PrintStatsBar = ({ stats, onReset }) => (
  <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Print Statistics
      </h3>
      <button
        onClick={onReset}
        className="text-sm text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-200 hover:border-red-300 transition-colors"
      >
        Reset Stats
      </button>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="text-center p-3 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
        <div className="text-sm text-gray-600">Total Prints</div>
      </div>
      <div className="text-center p-3 bg-green-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">{stats.today}</div>
        <div className="text-sm text-gray-600">Today</div>
      </div>
      <div className="text-center p-3 bg-purple-50 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">{stats.week}</div>
        <div className="text-sm text-gray-600">This Week</div>
      </div>
      <div className="text-center p-3 bg-orange-50 rounded-lg">
        <div className="text-2xl font-bold text-orange-600">{stats.month}</div>
        <div className="text-sm text-gray-600">This Month</div>
      </div>
      <div className="text-center p-3 bg-gray-50 rounded-lg">
        <div className="text-sm font-semibold text-gray-600">Last Print</div>
        <div className="text-xs text-gray-500">{stats.lastPrint}</div>
      </div>
    </div>
  </div>
);

const StudentIDPrintPage = () => {
  const [printSettings, setPrintSettings] = useState({
    layout: '2x2',
    showBorder: true,
    includeLogo: true
  });

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [printStats, setPrintStats] = useState(PrintStatsService.getFormattedStats());

  const { students, loading, error, fetchStudents, deleteStudent } = useStudents();

  // Update stats on component mount
  useEffect(() => {
    setPrintStats(PrintStatsService.getFormattedStats());
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map(s => s._id));
      setSelectAll(true);
    } else {
      setSelectedStudents([]);
      setSelectAll(false);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      const newSelection = prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId];
      
      setSelectAll(newSelection.length === students.length);
      return newSelection;
    });
  };

  const studentsToPrint = selectedStudents.length > 0
    ? students.filter(student => selectedStudents.includes(student._id))
    : students;

  const handlePrint = () => {
    if (studentsToPrint.length === 0) {
      toast.error('No students to print!');
      return;
    }

    // Show confirmation with count
    const confirmMessage = `Print ${studentsToPrint.length} student ID card${studentsToPrint.length > 1 ? 's' : ''}?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    // Update print statistics
    const updatedStats = PrintStatsService.updateStats(studentsToPrint.length);
    setPrintStats(PrintStatsService.getFormattedStats());

    // Show success message
    toast.success(`Printing ${studentsToPrint.length} ID cards!`, {
      duration: 3000,
      icon: '🖨️'
    });

    // Trigger print
    window.print();

    // Optional: Clear selection after printing
    setSelectedStudents([]);
    setSelectAll(false);
  };

  const handleExportPDF = () => {
    if (studentsToPrint.length === 0) {
      toast.error('No students to export!');
      return;
    }

    // Update print statistics for PDF export too
    const updatedStats = PrintStatsService.updateStats(studentsToPrint.length);
    setPrintStats(PrintStatsService.getFormattedStats());

    toast.success(`Exporting ${studentsToPrint.length} ID cards to PDF!`, {
      duration: 3000,
      icon: '📄'
    });

    console.log('PDF export functionality to be implemented');
  };

  const handleResetStats = () => {
    if (window.confirm('Are you sure you want to reset all print statistics? This cannot be undone.')) {
      PrintStatsService.clearStats();
      setPrintStats(PrintStatsService.getFormattedStats());
      toast.success('Print statistics reset successfully!');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading students for ID cards..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchStudents} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print Statistics Bar */}
      <div className="print:hidden bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <PrintStatsBar stats={printStats} onReset={handleResetStats} />
        </div>
      </div>

      <PrintHeader
        studentsToPrint={studentsToPrint}
        selectedStudents={selectedStudents}
        loading={loading}
        onRefresh={fetchStudents}
        onPrint={handlePrint}
        onExportPDF={handleExportPDF}
      />

      <StudentSelector
        students={students}
        selectedStudents={selectedStudents}
        selectAll={selectAll}
        onSelectAll={handleSelectAll}
        onSelectStudent={handleSelectStudent}
      />

      <div className="print:p-0 p-8">
        <div className="max-w-7xl mx-auto">
          {studentsToPrint.length === 0 ? (
            <EmptyState onRefresh={fetchStudents} />
          ) : (
            <IDCardGrid
              students={studentsToPrint}
              deleteStudent={deleteStudent}
              setSelectedStudents={setSelectedStudents}
              printSettings={printSettings}
            />
          )}
        </div>
      </div>

      <PrintStyles />
    </div>
  );
};

// Empty State Component
const EmptyState = ({ onRefresh }) => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <Printer className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 text-lg mb-2">No students available for printing</p>
    <p className="text-gray-400 text-sm mb-4">Add some students first or refresh the list</p>
    <button
      onClick={onRefresh}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
    >
      <RefreshCw className="w-4 h-4" />
      Refresh Students
    </button>
  </div>
);

// Export PrintStatsService for use in other components (like Dashboard)
export { PrintStatsService };

export default StudentIDPrintPage;