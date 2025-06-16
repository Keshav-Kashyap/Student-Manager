import React from 'react';
import { User } from 'lucide-react';
import StudentActions from './StudentActions';
import { formatDate } from '../../../utils/dateUtils';

const StudentRow = ({
  student,
  index,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(student._id)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
      <td className="px-6 py-4">
       <div className="w-12 h-12 rounded-xl overflow-hidden bg-blue-100 relative">
  {student.photoPath ? (
    <img
      src={student.photoPath}
      alt={student.name}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
  ) : null}
  <div
    className={`absolute inset-0 items-center justify-center text-blue-600 ${
      student.photoPath ? 'hidden' : 'flex'
    }`}
  >
    <User size={20} />
  </div>
</div>
        
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-gray-900">{student.name}</div>
        <div className="text-xs text-gray-500">ID: {student._id}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">{student.fatherName}</td>
      <td className="px-6 py-4 text-sm text-gray-700">{student.motherName}</td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Class {student.class}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(student.dateOfBirth)}</td>
      <td className="px-6 py-4 text-sm text-gray-700">{student.phone}</td>
      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{student.address}</td>
      <td className="px-6 py-4">
        <StudentActions
          studentId={student._id}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
};

export default StudentRow;