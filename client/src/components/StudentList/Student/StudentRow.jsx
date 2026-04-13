import React from 'react';
import { User } from 'lucide-react';
import StudentActions from './StudentActions';
import { formatDate } from '../../../Utils/dateUtils';

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
      <td className="w-10 px-4 py-4 align-top">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(student._id)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
      </td>
      <td className="w-14 px-4 py-4 align-top text-sm font-medium text-gray-900">{index + 1}</td>
      <td className="w-16 px-4 py-4 align-top">
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
            className={`absolute inset-0 items-center justify-center text-blue-600 ${student.photoPath ? 'hidden' : 'flex'
              }`}
          >
            <User size={20} />
          </div>
        </div>

      </td>
      <td className="px-4 py-4 align-top">
        <div className="whitespace-nowrap text-sm font-semibold text-gray-900">{student.name || 'N/A'}</div>
        <div className="whitespace-nowrap text-xs text-gray-500">ID: {student._id || 'N/A'}</div>
      </td>
      <td className="px-4 py-4 align-top text-sm text-gray-700 whitespace-nowrap">{student.fatherName || 'N/A'}</td>
      <td className="w-24 px-4 py-4 align-top">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 whitespace-nowrap">
          Class {student.class || 'N/A'}
        </span>
      </td>
      <td className="w-28 px-4 py-4 align-top text-sm text-gray-700 whitespace-nowrap">{formatDate(student.dateOfBirth || 'N/A')}</td>
      <td className="w-28 px-4 py-4 align-top text-sm text-gray-700 whitespace-nowrap">{student.phone || 'N/A'}</td>
      <td className="px-4 py-4 align-top text-sm text-gray-700 whitespace-nowrap">{student.address || 'N/A'}</td>
      <td className="w-16 px-4 py-4 align-top text-center">
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