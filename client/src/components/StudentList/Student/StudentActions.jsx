import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

const StudentActions = ({ studentId, onView, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => onView(studentId)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
        title="View Student"
      >
        <Eye size={16} />
      </button>
      <button 
        onClick={() => onEdit(studentId)}
        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-150"
        title="Edit Student"
      >
        <Edit size={16} />
      </button>
      <button 
        onClick={() => onDelete(studentId)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
        title="Delete Student"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default StudentActions;