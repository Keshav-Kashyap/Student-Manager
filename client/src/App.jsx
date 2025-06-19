import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import StudentList from "./pages/StudentList";
import PrintIDCard from "./pages/PrintIDCard";
import AddStudentPage from "./pages/AddStudentPage";
import EditStudentPage from "./pages/EditStudentPage";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MobileNavigation from "./components/MobileNavigation";
import { Toaster } from 'react-hot-toast';
import FlashMessageProvider from "./components/common/FlashMessageProvider";
import ConfirmDialog from "./components/common/ConfirmDialog";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import EditProfile from "./pages/EditProfile";
import PageNotFound from "./pages/page404";
import ViewStudentIDCardPage from "./pages/ViewStudent";

// Global Auth Hook
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const savedUser = localStorage.getItem("user");
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setIsAuthenticated(false);
        // Clear corrupted data
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { user, loading, isAuthenticated, login, logout, setUser };
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AuthenticatedLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, setUser } = useAuth();

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
          <Outlet context={{ user, setUser }} />
          <MobileNavigation/>
        </main>
      </div>
    </div>
  );
};

// Helper component to check if user is logged in and route accordingly
const ConditionalRoute = ({ component: Component, authPath }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }
  
  if (isAuthenticated) {
    // User is logged in, redirect to authenticated version
    return <Navigate to={authPath} replace />;
  }
  
  // User is not logged in, show full page component
  return <Component />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <FlashMessageProvider />
      <ConfirmDialog/>

      <Routes>
        {/* Public routes - redirect to dashboard if already logged in */}
        <Route path="/" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } />
        
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />
        
        {/* Conditional routes - full page if not logged in, redirect to app version if logged in */}
        <Route 
          path="/help" 
          element={<ConditionalRoute component={Help} authPath="/app/help" />} 
        />
        <Route 
          path="/about" 
          element={<ConditionalRoute component={About} authPath="/app/about" />} 
        />

        {/* Profile creation (full screen, no layout) */}
        <Route path="/create-profile" element={<EditProfile />} />

        {/* Protected app routes */}
        <Route path="/app" element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<StudentList />} />
          <Route path="students/add" element={<AddStudentPage />} />
          
          {/* Standardized edit route - use only one pattern */}
          <Route path="students/edit/:id" element={<EditStudentPage />} />
          
          {/* View student route */}
          <Route path="student/view/:id" element={<ViewStudentIDCardPage />} />
          
          <Route path="print" element={<PrintIDCard />} />
          
          {/* Help and About pages - shows with layout for logged in users */}
          <Route path="help" element={<Help />} />
          <Route path="about" element={<About />} />
          
          <Route path="edit" element={<EditProfile />} />
        </Route>

        {/* Redirect old routes to new standardized routes */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/students" element={<Navigate to="/app/students" replace />} />
        <Route path="/print" element={<Navigate to="/app/print" replace />} />
        <Route path="/add_new_student" element={<Navigate to="/app/students/add" replace />} />
        <Route path="/edit" element={<Navigate to="/app/edit" replace />} />
        <Route path="/app/create-profile" element={<Navigate to="/create-profile" replace />} />
        
        {/* Redirect old edit routes to new standardized route */}
        <Route path="/edit_student/:id" element={<Navigate to="/app/students/edit/:id" replace />} />
        <Route path="/app/edit_student/:id" element={<Navigate to="/app/students/edit/:id" replace />} />
        <Route path="/app/student/edit/:id" element={<Navigate to="/app/students/edit/:id" replace />} />

        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;