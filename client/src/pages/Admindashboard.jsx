import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import useAdminAnalytics from '../components/Admin/useAdminAnalytics';
import ModernStatCard from '../components/Admin/ModernStatCard';
import { ModernStatCardSkeleton } from '../components/Admin/ModernStatCardSkeleton';
import { getCardConfigs } from '../components/Admin/config/cardConfigs';
import UserTable from '../components/Admin/UserTable';
import UserDetailsView from '../components/Admin/UserDetailsView';
import { API_BASE } from '../config/api';

// import other needed icons
import {
  Users,
  Clock,
  CheckCircle,
  Zap,
  Award,
  Activity,
  BarChart3,
  TrendingUp,
  Shield,
  Calendar,
  Sun,
  Moon,
  Sunset
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [admin, setAdmin] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

  const { loading, error, analytics, totalStudents } = useAdminAnalytics();
  const cardConfigs = getCardConfigs(analytics, totalStudents);

  // Layout context se user mil jayega
  const context = useOutletContext();
  const { user } = context || {};

  // Get admin data from localStorage
  const getAdminData = () => {
    try {
      const adminData = localStorage.getItem('user');
      if (adminData) {
        const parsedAdmin = JSON.parse(adminData);
        setAdmin(parsedAdmin);
        return parsedAdmin;
      }
    } catch (error) {
      console.error('Error parsing admin data:', error);
    }
    return null;
  };

  // Fetch admin profile from backend
  const fetchAdminProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/profile/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const adminData = await response.json();
        const updatedAdminData = {
          ...adminData,
          isAuthenticated: true,
          lastFetch: new Date().toISOString()
        };
        localStorage.setItem('user', JSON.stringify(updatedAdminData));
        setAdmin(updatedAdminData);
      } else {
        console.error('Failed to fetch admin profile');
        getAdminData();
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      getAdminData();
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    const localAdmin = getAdminData();
    fetchAdminProfile();
  }, []);

  // Helper function to get admin initials
  const getAdminInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };
  useEffect(() => {
    if (admin !== null) {
      console.log("✅ Admin data updated:", admin);
    }
  }, [admin]);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: Sun };
    if (hour < 17) return { text: 'Good Afternoon', icon: Sun };
    if (hour < 20) return { text: 'Good Evening', icon: Sunset };
    return { text: 'Good Night', icon: Moon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Admin Avatar */}
                <div className="relative">

                  {admin?.profileImage ? (
                    <img
                      src={admin.profileImage}
                      alt="Admin Profile"
                      className="w-20 h-20 rounded-2xl object-cover shadow-lg border border-white/30"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                      {adminLoading ? (
                        <div className="w-12 h-12 bg-white/30 rounded-full animate-pulse"></div>
                      ) : (
                        <span className="text-white text-2xl font-bold">
                          {getAdminInitials(admin?.name || admin?.firstName)}
                        </span>
                      )}
                    </div>
                  )}


                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                    <Shield size={16} className="text-white" />
                  </div>
                </div>

                {/* Welcome Text */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GreetingIcon size={24} className="text-yellow-300" />
                    <h1 className="text-3xl font-bold">
                      {greeting.text}!
                    </h1>
                  </div>
                  {adminLoading ? (
                    <div className="space-y-2">
                      <div className="h-6 bg-white/20 rounded animate-pulse w-48"></div>
                      <div className="h-4 bg-white/20 rounded animate-pulse w-32"></div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-semibold mb-1">
                        Welcome back, {admin?.name || `${admin?.firstName || ''} ${admin?.lastName || ''}`.trim() || 'Admin'}
                      </h2>
                      <p className="text-purple-100 text-sm">
                        {admin?.role || 'Super Administrator'} • {'System Management'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="hidden lg:flex gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 text-white">
                    <Calendar size={18} />
                    <div>
                      <p className="text-xs text-purple-100">Today</p>
                      <p className="font-semibold">
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 text-white">
                    <Activity size={18} />
                    <div>
                      <p className="text-xs text-purple-100">Status</p>
                      <p className="font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Online
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Details Row */}
            {!adminLoading && admin && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {admin?.email && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <p className="text-xs text-purple-100 mb-1">Email</p>
                      <p className="text-sm font-medium truncate">{admin.email}</p>
                    </div>
                  )}
                  {admin?.phone && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <p className="text-xs text-purple-100 mb-1">Contact</p>
                      <p className="text-sm font-medium">{admin.phone}</p>
                    </div>
                  )}
                  {admin?.emergencyContact && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <p className="text-xs text-purple-100 mb-1">Emergency Contact
                      </p>
                      <p className="text-sm font-medium truncate">{admin.emergencyContact
                      }</p>
                    </div>
                  )}
                  {admin?.address && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <p className="text-xs text-purple-100 mb-1">address</p>
                      <p className="text-sm font-medium truncate">{admin.address}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}


          {/* Modern Analytics Cards */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Platform Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? cardConfigs.map((card, index) => (
                  <ModernStatCardSkeleton key={index} color={card.color} />
                ))
                : cardConfigs.map((card, index) => (
                  <ModernStatCard
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    trend={card.trend}
                    color={card.color}
                    subtitle={card.subtitle}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Other tabs content */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {selectedUser ? (
            <UserDetailsView
              user={selectedUser}
              onBack={() => setSelectedUser(null)}
            />
          ) : (
            <UserTable
              onUserSelect={setSelectedUser}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;