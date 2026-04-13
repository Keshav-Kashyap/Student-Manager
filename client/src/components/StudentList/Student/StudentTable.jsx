import React from 'react';
import StudentRow from './StudentRow';
import Pagination from '../common/Pagination';

const StudentTable =

    ({
        students,
        selectedStudents,
        onSelectAll,
        onSelectStudent,
        onView,
        onEdit,
        onDelete,
        totalStudents,
        currentPage = 1,
        totalPages = 1,
        onPageChange,
        limit = 10
    }) => {


        const isAllSelected = selectedStudents.length === students.length && students.length > 0;

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Student List</h2>
                        <span className="text-sm text-gray-600">{students.length} students found</span>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-[1220px] w-full table-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="w-10 px-4 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        onChange={onSelectAll}
                                        checked={isAllSelected}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                </th>
                                <th className="w-14 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">S. No.</th>
                                <th className="w-16 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Photo</th>
                                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Student Name</th>
                                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Father's Name</th>
                                <th className="w-24 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Class</th>
                                <th className="w-28 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">DOB</th>
                                <th className="w-28 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Mobile No.</th>
                                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Address</th>
                                <th className="w-16 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                                        No students found
                                    </td>
                                </tr>
                            ) : (
                                students.map((student, index) => (
                                    <StudentRow
                                        key={student._id}
                                        student={student}
                                        index={(currentPage - 1) * limit + index}
                                        isSelected={selectedStudents.includes(student._id)}
                                        onSelect={onSelectStudent}
                                        onView={onView}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="bg-gray-50 px-4 py-4 border-t border-gray-200 sm:px-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{students.length}</span> of{' '}
                            <span className="font-medium">{totalStudents}</span> students
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            </div>
        );
    };

export default StudentTable;