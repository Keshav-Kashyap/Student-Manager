import React from 'react';
import IDCard from './IDCard';
import { useNavigate } from 'react-router-dom';
import {
  handleViewStudent,
  handleEditStudent,
  handleDeleteStudent,
} from '../../handlers/studentHandlers';

// Example props: students, deleteStudent (func), setSelectedStudents (setter), printSettings
const IDCardGrid = ({ students, deleteStudent, setSelectedStudents, printSettings }) => {
  const navigate = useNavigate();


  const onView = (id) => handleViewStudent(navigate, id);
  const onEdit = (id) => handleEditStudent(navigate, id);
  const onDelete = (id) => handleDeleteStudent(id, deleteStudent, setSelectedStudents);

  const getGridClass = () => {
    switch (printSettings.layout) {
      case '2x2':
        return 'grid-cols-1 sm:grid-cols-2 print:grid-cols-2';
      case '3x2':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3';
      case '4x2':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 print:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 print:grid-cols-2';
    }
  };

  return (
    <>
      <div className={`grid gap-4 sm:gap-6 ${getGridClass()} print:gap-4 justify-items-center`}>
        {students.map((student) => (
          <div key={student._id} className="break-inside-avoid w-full max-w-lg">
            <IDCard
              student={student}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              printSettings={printSettings}
            />
          </div>
        ))}
      </div>

      <div className="hidden print:block mt-8 text-center text-xs text-gray-600 border-t pt-4">
        <p>© 2024. All rights reserved | Generated on: {new Date().toLocaleDateString()} | Total Cards: {students.length}</p>
      </div>
    </>
  );
};

export default IDCardGrid;
