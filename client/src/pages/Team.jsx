import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/StudentList/Layouts/header';
import StudentSearch from '../components/StudentList/Student/StudentSearch';
import StudentTable from '../components/StudentList/Student/StudentTable';
import ErrorMessage from '../components/StudentList/ui/ErrorMessage';
import StudentTableSkeleton from '@/components/StudentList/common/TableSkeleton';
import useStudents from '../Hooks/useStudent';
import {
    handleViewStudent,
    handleEditStudent,
    handleDeleteStudent,
    handleDeleteSelected,
} from '../handlers/studentHandlers';

const TeamPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const navigate = useNavigate();

    const {
        students,
        loading,
        error,
        fetchStudents,
        deleteStudent,
        deleteMultipleStudents,
        currentPage,
        totalPages,
        totalStudents,
        limit,
    } = useStudents();

    const filteredStudents = students.filter(
        (student) =>
            student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.class?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudents(filteredStudents.map((s) => s._id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSelectStudent = (studentId) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleAddNewMember = () => {
        navigate('/app/students/add');
    };

    const handlePageChange = async (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;

        await fetchStudents(page, limit);
        setSelectedStudents([]);
    };

    const handleExport = () => {
        console.log('Team export functionality to be implemented');
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <Header
                    onAddNewStudent={handleAddNewMember}
                    title="Team Management"
                    subtitle="Manage your team using the same student table format"
                    buttonLabel="Add Team Member"
                />
                <ErrorMessage error={error} onRetry={fetchStudents} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Header
                onAddNewStudent={handleAddNewMember}
                title="Team Management"
                subtitle="Manage your team using the same student table format"
                buttonLabel="Add Team Member"
            />

            <main className="w-full overflow-x-auto px-4 py-6 sm:px-6 lg:px-8 xl:px-10 lg:py-8">
                <StudentSearch
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onRefresh={() => fetchStudents(currentPage, limit)}
                    onExport={handleExport}
                    selectedCount={selectedStudents.length}
                    onDeleteSelected={() =>
                        handleDeleteSelected(selectedStudents, deleteMultipleStudents, setSelectedStudents)
                    }
                />

                {!loading ? (
                    <StudentTable
                        students={filteredStudents}
                        selectedStudents={selectedStudents}
                        onSelectAll={handleSelectAll}
                        onSelectStudent={handleSelectStudent}
                        onView={(id) => handleViewStudent(navigate, id)}
                        onEdit={(id) => handleEditStudent(navigate, id)}
                        onDelete={(id) => handleDeleteStudent(id, deleteStudent, setSelectedStudents)}
                        totalStudents={totalStudents}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        limit={limit}
                    />
                ) : (
                    <StudentTableSkeleton />
                )}
            </main>
        </div>
    );
};

export default TeamPage;
