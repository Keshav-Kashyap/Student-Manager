import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import IDCard from '../components/StudentId/IDCard';
import ErrorMessage from '../components/StudentList/ui/ErrorMessage';
import { getHeaders } from '../services/studentService';
import { API_BASE } from '../config/api';
import { useConfirm } from '../context/ConfirmDialogContext';
import SurajPrintingLoader from '../components/common/loader'
import {  
  handleEditStudent,
} from '../handlers/studentHandlers';

const ViewStudentIDCardPage = () => {                                                                                                                    
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const printSettings = {
    showBorder: true,
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(
         `${API_BASE}/api/students/${id}`,
          {
            method: 'GET',
           credentials: 'include',
          }
        );

        const resJson = await response.json();
        const result = resJson.data;

        if (response.ok && result) {
          setStudent(result);
        } else if (response.status === 404 || !result) {
          setStudent(null);
        } else {
          setError(resJson.message || 'Failed to load student data');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleEdit = () => {
    handleEditStudent(navigate, student._id);
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleHome = () => {
    navigate('/dashboard'); // Go to students list
  };

  const confirm = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm(
      "Are you sure you want to delete this student?",
      "Delete Student"
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`${API_BASE}/api/students/${student._id}`, {
        method: 'DELETE',
      credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setStudent(null);
        setTimeout(() => {
          navigate('/students');
        }, 1500);
      } else {
        setError(data.message || 'Failed to delete student');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <SurajPrintingLoader title="Student Loading..."  />
  if (error) return <ErrorMessage message={error} />;
  
  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center mt-20">
          {isDeleting ? (
            <div className="text-center">
            <SurajPrintingLoader title="Loading..." />
              <p className="text-xl font-semibold text-gray-700 mt-4">
                Deleting student...
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-700">
                Student deleted successfully!
              </p>
              <p className="text-gray-500 mt-2">
                Redirecting to student list...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
                disabled={isDeleting}
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Back</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <button
                onClick={handleHome}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                disabled={isDeleting}
              >
                <Home size={18} />
                <span className="font-medium">Student List</span>
              </button>
            </div>

            {/* Student Info */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {student.fullName}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {student.studentId}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {student.fullName?.charAt(0)?.toUpperCase() || 'S'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ID Card Display */}
      <div className="flex items-center justify-center pt-8 pb-16">
        <div className="scale-110 sm:scale-125 md:scale-[1.4] lg:scale-[1.5] origin-top">
          <IDCard
            student={student}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showView={false}
            printSettings={printSettings}
            disabled={isDeleting}
          />
        </div>
      </div>

      {/* Quick Actions (Optional) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={handleBack}
          className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:shadow-xl transition-all duration-200 hover:scale-105"
          disabled={isDeleting}
          title="Go Back"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        
        <button
          onClick={handleHome}
          className="w-12 h-12 bg-blue-500 shadow-lg rounded-full flex items-center justify-center hover:shadow-xl hover:bg-blue-600 transition-all duration-200 hover:scale-105"
          disabled={isDeleting}
          title="Student List"
        >
          <Home size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ViewStudentIDCardPage;