// App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import StudentList from "./pages/StudentList";
import PrintIDCard from "./pages/PrintIDCard";
import AddStudentPage from "./pages/AddStudentPage";
import EditStudentPage from "./pages/EditStudentPage";
import Help from "./pages/Help";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import MobileNavigation from "./components/MobileNavigation";
import { Toaster } from 'react-hot-toast';
import FlashMessageProvider from "./components/common/FlashMessageProvider";
import { ConfirmDialogProvider } from './context/ConfirmDialogContext';
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import EditProfile from "./pages/EditProfile";
import PageNotFound from "./pages/page404";
import ViewStudentIDCardPage from "./pages/ViewStudent";
import GoogleRedirect from "./pages/Auth/Google-redirect";
import Admindashboard from "./pages/Admindashboard"
import UserManagement from "./pages/UserManagement";
import UserDetailedPage from "./pages/UserDetailedPage";
import AdminViewStudent from "./pages/AdminViewStudent";
import AdminLayout from "./Layouts/AdminLayout";
import SurajPrintingLoader from './components/common/loader'
import VerifyEmailPage from './pages/Auth/EmailConfirmation'
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { UserManager } from "./Utils/UserManager";



const AuthenticatedLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user data and set up listeners
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUser = UserManager.getSavedUser();
        if (savedUser) {
          setUser(savedUser);
        } else {
          setUser(null);
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        UserManager.clearUser();
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();

    // Listen for user data changes
    const handleUserDataChange = (event) => {
      const userData = event.detail;
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
        navigate("/login", { replace: true });
      }
    };

    // Listen for localStorage changes (cross-tab sync)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        loadUserData();
      }
    };

    window.addEventListener('userDataChanged', handleUserDataChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('userDataChanged', handleUserDataChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  // Sidebar togglers
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Close sidebar on mobile resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  if (loading) {
    return (
      <SurajPrintingLoader title="Loading..." />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar user={user} />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} className="h-[calc(100vh-64px)]" user={user} />

        <main
          className={`flex-1 p-0 overflow-auto transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "lg:ml-80" : "lg:ml-0"
          }`}
        >
          <Outlet context={{ user, setUser: UserManager.saveUser, clearUser: UserManager.clearUser }} />
          <MobileNavigation/>
        </main>
      </div>
    </div>
  );
};

// Helper component to check if user is logged in and route accordingly
const ConditionalRoute = ({ component: Component, authPath }) => {
  const isLoggedIn = UserManager.getSavedUser();
  
  if (isLoggedIn) {
    return <Navigate to={authPath} replace />;
  }
  
  return <Component />;
};

function App() {
  return (
    <>
      <FlashMessageProvider />
      <ConfirmDialogProvider> 
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Admindashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="users/:id" element={<UserDetailedPage />} />
              <Route path="student/view/:id" element={<AdminViewStudent />} />
            </Route>
          </Route>

          {/* Conditional routes */}
          <Route 
            path="/help" 
            element={<ConditionalRoute component={Help} authPath="/app/help" />} 
          />
          <Route 
            path="/about" 
            element={<ConditionalRoute component={About} authPath="/app/about" />} 
          />

          <Route path="/google-redirect" element={<GoogleRedirect />} />
          <Route path="/verify-email" element={<VerifyEmailPage/>}/>
          <Route path="/verify-email-cheak" element={<VerifyEmailPage/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>
          <Route path="/create-profile" element={<EditProfile />} />

          {/* Protected Teacher Routes */}
          <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
            <Route path="/app" element={<AuthenticatedLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="students" element={<StudentList />} />
              <Route path="students/add" element={<AddStudentPage />} />
              <Route path="students/edit/:id" element={<EditStudentPage />} />
              <Route path="student/view/:id" element={<ViewStudentIDCardPage />} />
              <Route path="print" element={<PrintIDCard />} />
              <Route path="help" element={<Help />} />
              <Route path="about" element={<About />} />
              <Route path="edit" element={<EditProfile />} />
            </Route>
          </Route>

          {/* Redirects */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/students" element={<Navigate to="/app/students" replace />} />
          <Route path="/print" element={<Navigate to="/app/print" replace />} />
          <Route path="/add_new_student" element={<Navigate to="/app/students/add" replace />} />
          <Route path="/edit" element={<Navigate to="/app/edit" replace />} />
          <Route path="/app/create-profile" element={<Navigate to="/create-profile" replace />} />
          <Route path="/edit_student/:id" element={<Navigate to="/app/students/edit/:id" replace />} />
          <Route path="/app/edit_student/:id" element={<Navigate to="/app/students/edit/:id" replace />} />
          <Route path="/app/student/edit/:id" element={<Navigate to="/app/students/edit/:id" replace />} />

          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ConfirmDialogProvider>
    </>
  );
}

export default App;