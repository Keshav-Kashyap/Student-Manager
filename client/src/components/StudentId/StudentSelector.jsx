import React from 'react';

const StudentSelector = ({
  students,
  selectedStudents,
  selectAll,
  onSelectAll,
  onSelectStudent
}) => {
  if (students.length === 0) return null;

  return (
    <div className="print:hidden bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={onSelectAll}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Select All ({students.length} students)
              </span>
            </label>

            <div className="text-sm text-gray-600">
              {selectedStudents.length === 0
                ? "All students will be printed"
                : `${selectedStudents.length} students selected for printing`
              }
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-3 max-h-40 overflow-y-auto">
            {students.map((student) => (
              <StudentCheckbox
                key={student._id}
                student={student}
                isSelected={selectedStudents.includes(student._id)}
                onSelect={() => onSelectStudent(student._id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Student Checkbox Component
const StudentCheckbox = ({ student, isSelected, onSelect }) => (
  <label className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
    <input
      type="checkbox"
      checked={isSelected}
      onChange={onSelect}
      className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
    />
    <span className="text-xs text-gray-700 truncate">
      {student.name} ({student.class || 'N/A'})
    </span>
  </label>
);

export default StudentSelector;