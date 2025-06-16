import { useState, useEffect } from 'react';
import * as studentService from '../services/studentService';

const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.fetchStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      await studentService.deleteStudent(studentId);
      setStudents(prev => prev.filter(student => student._id !== studentId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting student:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteMultipleStudents = async (studentIds) => {
    try {
      await studentService.deleteMultipleStudents(studentIds);
      setStudents(prev => prev.filter(student => !studentIds.includes(student._id)));
      return { success: true };
    } catch (err) {
      console.error('Error deleting students:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    fetchStudents,
    deleteStudent,
    deleteMultipleStudents
  };
};

export default useStudents;