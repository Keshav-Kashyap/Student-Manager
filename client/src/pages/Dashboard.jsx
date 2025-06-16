import React, { useState, useEffect } from 'react';
import { Users, Printer, BarChart3 } from 'lucide-react';

// Components
import StatCard from '../components/StatCard';
import UserWelcomeSection from '../components/dashboard/UserWelcomeSection';
import ProfileCompletionAlert from '../components/dashboard/ProfileCompletionAlert';
import UserProfileCard from '../components/dashboard/UserProfileCard';

// Hooks
import useStudents from '../Hooks/useStudent';

// Print Statistics Service
const PrintStatsService = {
  getStats: () => {
    const stats = localStorage.getItem('printStats');
    return stats ? JSON.parse(stats) : {
      totalPrints: 0,
      todayPrints: 0,
      thisWeekPrints: 0,
      thisMonthPrints: 0,
      lastPrintDate: null,
      printHistory: []
    };
  },

  getFormattedStats: () => {
    const stats = PrintStatsService.getStats();
    return {
      total: stats.totalPrints,
      today: stats.todayPrints,
      week: stats.thisWeekPrints,
      month: stats.thisMonthPrints,
      lastPrint: stats.lastPrintDate ? new Date(stats.lastPrintDate).toLocaleDateString() : 'Never'
    };
  }
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    printedId: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const { students, loading: studentsLoading, fetchStudents } = useStudents();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!studentsLoading && students) {
      // Get print count from localStorage
      const printStats = PrintStatsService.getFormattedStats();
      
      setStats(prevStats => ({
        ...prevStats,
        students: students.length,
        printedId: printStats.total // Use total print count from localStorage
      }));
      setLoading(false);
    }
  }, [students, studentsLoading]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      // Get print stats from localStorage instead of API
      const printStats = PrintStatsService.getFormattedStats();

      const response = await fetch('/api/dashboard/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          students: stats.students || 0,
          printedId: printStats.total // Use localStorage data instead of API
        });
      } else {
        console.error('Failed to fetch dashboard data');
        setStats({
          students: 0,
          printedId: printStats.total // Use localStorage data even if API fails
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      const printStats = PrintStatsService.getFormattedStats();
      setStats({
        students: 0,
        printedId: printStats.total // Use localStorage data on error
      });
    } finally {
      setLoading(false);
    }
  };

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return parsedUser;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return null;
  };

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('/api/profile/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        
        const updatedUserData = {
          ...userData,
          isAuthenticated: true,
          lastFetch: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        setUser(updatedUserData);
      } else {
        console.error('Failed to fetch user profile');
        getUserData();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      getUserData();
    }
  };

  // Refresh stats function (to update print count in real-time)
  const refreshStats = () => {
    const printStats = PrintStatsService.getFormattedStats();
    setStats(prevStats => ({
      ...prevStats,
      printedId: printStats.total
    }));
  };

  useEffect(() => {
    const localUser = getUserData();
    fetchUserProfile();
    fetchDashboardData();

    // Refresh stats every 30 seconds to catch any print updates
    const interval = setInterval(refreshStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const statsCards = [
    { 
      title: "Students", 
      value: loading ? "..." : stats.students.toString(), 
      icon: Users 
    },
    { 
      title: "Printed ID Cards", 
      value: loading ? "..." : stats.printedId.toString(), 
      icon: Printer 
    }
  ];

  // Check if profile is complete
  const isProfileComplete = user && user.collegeName && user.department;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="h-full w-full p-6 rounded-xl bg-blue-50 overflow-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 size={28} className="text-white" />
            </div>
            Dashboard
          </h1>
          
          {/* User Welcome Section */}
          <UserWelcomeSection user={user} isProfileComplete={isProfileComplete} />

          {/* Profile Completion Alert */}
          <ProfileCompletionAlert user={user} isProfileComplete={isProfileComplete} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <StatCard 
              key={index}
              title={card.title}
              value={card.value}
              Icon={card.icon}
            />
          ))}
        </div>
        
        {/* User Profile Card */}
        <UserProfileCard user={user} />
      </div>
    </div>
  );
};

export default Dashboard;