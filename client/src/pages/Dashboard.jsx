import React, { useState, useEffect } from 'react';
import { Users, Printer, BarChart3, RefreshCw } from 'lucide-react';
// Components
import StatCard from '../components/StatCard';
import UserWelcomeSection from '../components/dashboard/UserWelcomeSection';
import ProfileCompletionAlert from '../components/dashboard/ProfileCompletionAlert';
import UserProfileCard from '../components/dashboard/UserProfileCard';
import PrintStatsService from '../Utils/printStatsService';
// Hooks
import useStudents from '../Hooks/useStudent';
import useUser from '../Hooks/useUser';

// Print Statistics Service


const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    printedId: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const { students, loading: studentsLoading } = useStudents();
  const { user, loading: userLoading } = useUser();

  // Refresh stats manually instead of polling
  const refreshStats = async () => {
    try {
      const printStats = await PrintStatsService.getFormattedStats();

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
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (!studentsLoading && students) {
      refreshStats();
    }
  }, [students, studentsLoading]);

  // Manual refresh only; no background polling
  const handleRefreshStats = async () => {
    try {
      setStatsLoading(true);
      const printStats = await PrintStatsService.getFormattedStats();

      setStats(prev => ({
        ...prev,
        students: students.length,
        printedId: printStats.total
      }));
    } finally {
      setStatsLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Students',
      value: studentsLoading ? '...' : stats.students.toString(),
      icon: Users
    },
    {
      title: 'Printed ID Cards',
      value: statsLoading ? '...' : stats.printedId.toString(),
      icon: Printer
    }
  ];

  // Check if profile is complete
  const isProfileComplete = user && user.collegeName && user.department;
  const isPageLoading = userLoading || studentsLoading || statsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="h-full w-full p-6 rounded-xl bg-blue-50 overflow-auto">
        <div className="mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <h1 className="text-4xl font-extrabold text-indigo-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 size={28} className="text-white" />
              </div>
              Dashboard
            </h1>

            <button
              type="button"
              onClick={handleRefreshStats}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50"
            >
              <RefreshCw size={16} className={statsLoading ? 'animate-spin' : ''} />
              Refresh stats
            </button>
          </div>

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

        {isPageLoading && (
          <p className="mt-4 text-sm text-slate-500">Loading dashboard data...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;