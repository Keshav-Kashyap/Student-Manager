import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IDCard from '../components/StudentId/IDCard';
import LoadingSpinner from '../components/StudentList/ui/LoadingSpinner';
import ErrorMessage from '../components/StudentList/ui/ErrorMessage';
import { getHeaders } from '../services/studentService';
import {
  handleEditStudent,
} from '../handlers/studentHandlers';

const ViewStudentIDCardPage = () => {                                                                                                                    
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // Add loading state for delete

  const printSettings = {
    showBorder: true,
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(
          `https://student-management-34a5.onrender.com/api/students/${id}`,
          {
            method: 'GET',
            headers: getHeaders(),
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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      // Direct API call without using handler
      const response = await fetch(`https://student-management-34a5.onrender.com/api/students/${student._id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('Student deleted successfully'); // Debug log
        setStudent(null); // This should hide the card
        setIsDeleting(false);
        
        // Optional: Show success message for 2 seconds then navigate
        setTimeout(() => {
          navigate('/students'); // Navigate back to student list
        }, 1500);
      } else {
        console.error('Delete failed:', data.message); // Debug log
        setError(data.message || 'Failed to delete student');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Network error:', error); // Debug log
      setError('Network error occurred');
      setIsDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center mt-20">
          {isDeleting ? (
            <div className="text-center">
              <LoadingSpinner />
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
      <div className="flex items-center justify-center mt-10">
        <div className="scale-110 sm:scale-125 md:scale-[1.4] lg:scale-[1.5] origin-top">
          <IDCard
            student={student}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showView={false}
            printSettings={printSettings}
            disabled={isDeleting} // Disable buttons during delete
          />
        </div>
      </div>
    </div>
  );
};

export default ViewStudentIDCardPage;