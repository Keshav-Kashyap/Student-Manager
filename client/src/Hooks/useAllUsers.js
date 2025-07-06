import { useState, useEffect } from 'react';
import { API_BASE } from '../config/api';



const useAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0); // ✅ New state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllUsers = async () => {
   

    try {
      const response = await fetch(`${API_BASE}/api/admin`, {
        method: 'GET',
        credentials: 'include',

        headers: {
          
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();

      // ✅ Extract both users and total count
      setUsers(data.users || []);
      setTotalStudents(data.totalStudents || 0);
    } catch (err) {
      console.error("❌ Error fetching all users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return {
    users,
    totalStudents, // ✅ Exported for your dashboard
    loading,
    error,
    refetch: fetchAllUsers,
  };
};

export default useAllUsers;
