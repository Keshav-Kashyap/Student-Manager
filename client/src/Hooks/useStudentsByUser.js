// src/hooks/useStudentsByUser.js
import { useState, useEffect } from 'react';
import { API_BASE } from '../config/api';

const useStudentsByUser = (userId) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/students/user/${userId}`, {
          method: 'GET',
          credentials: 'include', // ✅ Send JWT cookie
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await res.json();
        if (res.ok) {
          setStudents(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch students');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [userId]);

  return { students, loading, error };
};

export default useStudentsByUser;
