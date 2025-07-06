// UserDetailsView.js - Updated version with Export
import React from 'react';
import { ArrowLeft, Building2, CreditCard, Eye, Phone, Mail, User, MapPin, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAllUsers from '../../Hooks/useAllUsers';
import useAdminAnalytics from './useAdminAnalytics';

const UserDetailsView = ({ user }) => {
  const {analytics } = useAdminAnalytics();
  const  user2 = useAllUsers();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No User Selected</h3>
          <p className="text-gray-600">Please go back and select a user to view details.</p>
          <button 
            onClick={() => navigate('/admin/users')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back to Users
          </button>
        </div>
      </div>
    );
  }

  const handleViewStudent = (studentId) => {
    console.log("navigating...");
    navigate(`/admin/student/view/${studentId}`);
  };

  const handleExportStudents = () => {
    const students = user.students || [];
    if (students.length === 0) {
      alert('No students to export');
      return;
    }

    // Prepare data for CSV export
    const csvData = students.map(student => ({
      'Photo URL': student.photoPath || 'N/A',
      'Student Name': student.name || 'N/A',
      'Class': student.class || 'N/A',
      'Section': student.section || 'N/A',
      'Roll No': student.rollNo || 'N/A',
      'Father Name': student.fatherName || 'N/A',
      'Phone': student.phone || student.mobile || 'N/A',
      'Date of Birth': student.dateOfBirth 
        ? new Date(student.dateOfBirth).toLocaleDateString('en-IN')
        : student.dob || 'N/A',
      'Address': student.address || 'N/A',
      'Status': student.status || 'Pending',
      'Submitted Date': student.createdAt || student.submittedDate
        ? new Date(student.createdAt || student.submittedDate).toLocaleDateString('en-IN')
        : 'N/A',
      'Student ID': student.studentId || student._id?.slice(-8) || 'N/A'
    }));

    // Convert to CSV
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => 
          `"${String(row[header]).replace(/"/g, '""')}"` // Escape quotes
        ).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${user.name}_Students_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Use user.students directly instead of hook
  const students = user.students || [];
  console.log("ADMIN ANLYATICS: ", 

  )
  console.log(`User ID: ${user._id}`, 'Students:', students);
  console.log('Full user object:', user);
  console.log('User 2: Full Information:', user2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Back Button */}
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-blue-600 hover:text-blue-700 font-medium border border-blue-100 hover:border-blue-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Users
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30 overflow-hidden">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold mb-2">{user.name || 'Unknown User'}</h1>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 opacity-90" />
                    <p className="text-xl opacity-95">{user.collegeName || 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 opacity-90" />
                    <p className="opacity-90">{user.email || 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 opacity-90" />
                    <p className="opacity-90">{user.phone || 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 opacity-90" />
                    <p className="opacity-90"> {user.designation}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Updated Stats Card with Export Button */}
            <div
              className="rounded-2xl p-6 backdrop-blur-sm border border-[rgba(255,255,255,0.2)] min-w-[200px]"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.20)' }}
            >
              <p className="text-4xl font-bold text-center">{students.length}</p>
              <p className="text-sm opacity-90 text-center mt-1 mb-4">Total Students</p>
              
              {/* Export Button */}
              <button
                onClick={handleExportStudents}
                disabled={students.length === 0}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  students.length === 0
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-60'
                    : 'bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg'
                }`}
                title={students.length === 0 ? 'No students to export' : 'Export student data to CSV'}
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800">Student ID Card Records</h2>
            <p className="text-gray-600 mt-2 text-lg">All students submitted by {user.name}</p>
          </div>

          {students.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Students Found</h3>
              <p className="text-gray-500 text-lg">This user hasn't submitted any student records yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Roll No
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Submitted Date
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr key={student._id || student.id || index} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {student.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{student.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-gray-700">{student.class || 'N/A'}</td>
                      <td className="px-8 py-6 text-gray-700 font-mono">{student.rollNo || 'N/A'}</td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          student.status === 'Active' || student.status === 'active'
                            ? 'bg-green-100 text-green-800' 
                            : student.status === 'Pending' || student.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-gray-700">
                        {student.createdAt || student.submittedDate
                          ? new Date(student.createdAt || student.submittedDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })
                          : 'N/A'
                        }
                      </td>
                      <td className="px-8 py-6">
                        <button 
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                          onClick={() => handleViewStudent(student._id)}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsView;