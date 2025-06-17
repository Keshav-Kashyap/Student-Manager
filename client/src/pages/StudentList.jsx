import React, { useState } from 'react';
import Header from '../components/StudentList/Layouts/header';
import StudentSearch from '../components/StudentList/Student/StudentSearch';
import StudentTable from '../components/StudentList/Student/StudentTable';
import LoadingSpinner from '../components/StudentList/ui/LoadingSpinner';
import ErrorMessage from '../components/StudentList/ui/ErrorMessage';
import useStudents from '../Hooks/useStudent';

import { useNavigate } from 'react-router-dom';
import {
  handleViewStudent,
  handleEditStudent,
  handleDeleteStudent,
  handleDeleteSelected
} from '../handlers/studentHandlers';

const StudentListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const navigate = useNavigate();

  const {
    students,
    loading,
    error,
    fetchStudents,
    deleteStudent,
    deleteMultipleStudents
  } = useStudents();

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(filteredStudents.map(s => s._id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAddNewStudent = () => {
    navigate('/app/students/add');
  };

  const handleExport = () => {
    console.log('Export functionality to be implemented');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

        <Header onAddNewStudent={handleAddNewStudent} />
        <LoadingSpinner message="Loading students..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

        <Header onAddNewStudent={handleAddNewStudent} />
        <ErrorMessage error={error} onRetry={fetchStudents} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      <Header onAddNewStudent={handleAddNewStudent} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StudentSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRefresh={fetchStudents}
          onExport={handleExport}
          selectedCount={selectedStudents.length}
          onDeleteSelected={() =>
            handleDeleteSelected(selectedStudents, deleteMultipleStudents, setSelectedStudents)
          }
        />

        <StudentTable
          students={filteredStudents}
          selectedStudents={selectedStudents}
          onSelectAll={handleSelectAll}
          onSelectStudent={handleSelectStudent}
          onView={(id) => handleViewStudent(navigate, id)}
          onEdit={(id) => handleEditStudent(navigate, id)}
          onDelete={(id) =>
            handleDeleteStudent(id, deleteStudent, setSelectedStudents)
          }
          totalStudents={students.length}
        />
      </div>
    </div>
  );
};

export default StudentListPage;
