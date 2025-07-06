// pages/StudentIDPrintPage.jsx
import React, { useState, useEffect } from 'react';
import { RefreshCw, Printer, FileText, BarChart3 } from 'lucide-react';
import SurajPrintingLoader from '../components/common/loader'
import ErrorMessage from '../components/StudentList/ui/ErrorMessage';
import useStudents from '../Hooks/useStudent';
import PrintHeader from '../components/StudentId/PrintHeader';
import StudentSelector from '../components/StudentId/StudentSelector';
import IDCardGrid from '../components/StudentId/IDCardGrid';
import PrintStyles from '../components/StudentId/PrintStyles';
import toast from 'react-hot-toast';
import { handleDeleteStudent } from '../handlers/studentHandlers';
import PrintStatsService from '../Utils/printStatsService'; // ✅ your backend API-based service
import { useConfirm } from '../context/ConfirmDialogContext';
import { API_BASE } from '../config/api';

// Print Statistics Component
const PrintStatsBar = ({ stats }) => (
  <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Print Statistics
      </h3>
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
  const [printStats, setPrintStats] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const confirm = useConfirm(); 
  const { students, setStudents, loading, error, fetchStudents, deleteStudent } = useStudents();

  useEffect(() => {
    const fetchStats = async () => {
      const backendStats = await PrintStatsService.getFormattedStats();
      setPrintStats(backendStats);
    };
    fetchStats();
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

  const handlePrint = async () => {
    if (studentsToPrint.length === 0) {
      toast.error('No students to print!');
      return;
    }

    const confirmed = await confirm(
      "Are you sure you want to print selected students' ID cards?",
      "Print ID Cards"
    );
    
    if (confirmed) {
      handleConfirmPrint();
    }
  };

  const handleConfirmPrint = async () => {
    setIsPrinting(true);

    try {
      const studentIds = studentsToPrint.map(student => student._id);

      const response = await fetch(`${API_BASE}/api/students/update-print-status`, {
        method: 'PUT',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentIds,
          printStatus: 'printed',
          printedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error('Failed to update print status');

      await fetchStudents();

      const updatedStats = await PrintStatsService.getFormattedStats();
      setPrintStats(updatedStats);

      toast.success(`Sent ${studentsToPrint.length} ID card(s) to print queue ✅`, {
        duration: 3000,
        icon: '📤'
      });

      setSelectedStudents([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Error updating print status:', error);
      toast.error('Failed to send to print. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleExportPDF = async () => {
    if (studentsToPrint.length === 0) {
      toast.error('No students to export!');
      return;
    }

    // Update print statistics for PDF export too
    const updatedStats = await PrintStatsService.getFormattedStats();
    setPrintStats(updatedStats);

    toast.success(`Exporting ${studentsToPrint.length} ID cards to PDF!`, {
      duration: 3000,
      icon: '📄'
    });

    console.log('PDF export functionality to be implemented');
  };

  if (loading || isPrinting) {
    return (
      <SurajPrintingLoader title="Students Id Cards Are Fetching..." subtitle="Loading students for ID cards..." />
    );
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchStudents} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print Statistics Bar */}
      <div className="print:hidden bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <PrintStatsBar stats={printStats} />
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

      <div className="print:p-0 p-8 mb-[50px] ">
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