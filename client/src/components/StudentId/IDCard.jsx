import React from 'react';
import { Eye, Edit, Trash2, User } from 'lucide-react';

const IDCard = ({ student, onView, onEdit, onDelete, showView = true }) => {
  const imageUrl = student.photoPath;
  
  // Function to get print status styling
  const getPrintStatusStyle = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('printed') || statusLower.includes('complete')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (statusLower.includes('pending') || statusLower.includes('queue')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (statusLower.includes('error') || statusLower.includes('failed')) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200 w-full max-w-sm">
  {student.updatedAfterPrint && (
  <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-xs text-white px-3 py-1 rounded-full font-bold shadow-lg animate-pulse border-2 border-white">
    <span className="relative flex items-center gap-1">
      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
      Updated
    </span>
  </div>
)}
    
      {/* Student Photo and Name */}
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={student.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`w-full h-full flex items-center justify-center text-gray-400 ${imageUrl ? 'hidden' : 'flex'}`}
          >
            <User size={24} />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{student.name}</h3>
            {/* Modern Print Status Badge - Top Right */}
            {student.printStatus && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPrintStatusStyle(student.printStatus)}`}>
                {student.printStatus.charAt(0).toUpperCase() + student.printStatus.slice(1).toLowerCase()}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">Class: {student.class} - {student.section || 'A'}</p>
        </div>
      </div>

      {/* Student Details */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Phone:</span>
          <span className="font-medium">{student.phone || student.mobile || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Father:</span>
          <span className="font-medium">{student.fatherName || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">DOB:</span>
          <span className="font-medium">
            {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-GB') : student.dob || 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Address:</span>
          <span className="font-medium text-right max-w-[60%] truncate">{student.address || 'N/A'}</span>
        </div>
      </div>

      {/* Footer and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          ID: {student.studentId || student._id?.slice(-4).toUpperCase()} | Valid Till: 2025
        </div>
        <div className="flex items-center gap-2">
          {showView && (
             <button
              onClick={() => onView?.(student._id)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
              title="View Student"
            >
              <Eye size={16} />
            </button>
          )}

 {onEdit && (
          <button
            onClick={() => onEdit?.(student._id)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-150"
            title="Edit Student"
          >
            <Edit size={16} />
          </button>
 )}

   {onDelete && (
          <button
            onClick={() => onDelete?.(student._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
            title="Delete Student"
          >
            <Trash2 size={16} />
          </button>
   )} 
        </div>
      </div>
    </div>
  );
};

export default IDCard;