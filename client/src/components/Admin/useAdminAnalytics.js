import useAllUsers from '../../Hooks/useAllUsers';
import AdminPrintStatsService from './utils/adminPrintStatsService';
import { useEffect, useState } from 'react';

const useAdminAnalytics = () => {
  const { users, loading, error, totalStudents } = useAllUsers();

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;

  const [printedStats, setPrintedStats] = useState({
    total: 0,
    groupedByDate: {}
  });

  useEffect(() => {
    const fetchPrintStats = async () => {
      const stats = await AdminPrintStatsService.getFormattedStats();
      setPrintedStats(stats);
    };

    fetchPrintStats();
  }, []);

  // Static or to-be-replaced values
  const studentsSubmitted = 456;
  const pendingRequests = 158;
  const monthlyGrowth = 12.5;
  const completionRate = 65.4;
  const todayRequests = 23;

  return {
    loading,
    error,
    totalStudents,
    analytics: {
      totalUsers,
      activeUsers,
      studentsSubmitted,
      studentsCompleted: printedStats.total, 
      pendingRequests,
      monthlyGrowth,
      completionRate, 
      
    }
  };
};

export default useAdminAnalytics;