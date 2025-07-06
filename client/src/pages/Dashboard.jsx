import React, { useState, useEffect } from 'react';
import { Users, Printer, BarChart3 } from 'lucide-react';
import { API_BASE } from '../config/api';
// Components
import StatCard from '../components/StatCard';
import UserWelcomeSection from '../components/dashboard/UserWelcomeSection';
import ProfileCompletionAlert from '../components/dashboard/ProfileCompletionAlert';
import UserProfileCard from '../components/dashboard/UserProfileCard';
import PrintStatsService from '../utils/printStatsService';



// Hooks
import useStudents from '../Hooks/useStudent';

// Print Statistics Service


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
  const updateStats = async () => {
    if (!studentsLoading && students) {
      const printStats = await PrintStatsService.getFormattedStats(); // ✅ await here

      setStats(prevStats => ({
        ...prevStats,
        students: students.length,
        printedId: printStats.total
      }));

      setLoading(false);
    }
  };

  updateStats();
}, [students, studentsLoading]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
    

      const printStats = await PrintStatsService.getFormattedStats(); // ✅ Use API-based stats

      setStats(prev => ({
        ...prev,
        students: students.length,
        printedId: printStats.total
      }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({
        ...prev,
        printedId: 0
      }));
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
   

      const response = await fetch(`${API_BASE}/api/profile/me`, {
        method: 'GET',
         credentials: 'include',
        headers: {
        
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
  const refreshStats = async () => {
    const printStats = await PrintStatsService.getFormattedStats();
    setStats(prev => ({
      ...prev,
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