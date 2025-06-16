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

const AuthenticatedLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user data from localStorage and redirect if no user
  useEffect(() => {
    const loadUserData = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
        navigate("/login", { replace: true });
      }
      setLoading(false);
    };

    loadUserData();
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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading...
      </div>
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
          <Outlet context={{ user, setUser }} />
          <MobileNavigation/>
        </main>
      </div>
    </div>
  );
};

// Helper component to check if user is logged in and route accordingly
const ConditionalRoute = ({ component: Component, authPath }) => {
  const isLoggedIn = localStorage.getItem("user");
  
  if (isLoggedIn) {
    // User is logged in, redirect to authenticated version
    return <Navigate to={authPath} replace />;
  }
  
  // User is not logged in, show full page component
  return <Component />;
};

function App() {
  return (
    <>
      <FlashMessageProvider />
      <ConfirmDialog/>

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
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
        <Route path="/app" element={<AuthenticatedLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<StudentList />} />
          <Route path="students/add" element={<AddStudentPage />} />
          <Route path="students/edit/:id" element={<EditStudentPage />} />
          <Route path="edit_student/:id" element={<EditStudentPage />} />
          <Route path="student/edit/:id" element={<EditStudentPage />} />
          <Route path="student/view/:id" element={<ViewStudentIDCardPage />} />
          <Route path="print" element={<PrintIDCard />} />
          
          {/* Help and About pages - shows with layout for logged in users */}
          <Route path="help" element={<Help />} />
          <Route path="about" element={<About />} />
          
          <Route path="edit" element={<EditProfile />} />
        </Route>

        {/* Redirect old routes */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/students" element={<Navigate to="/app/students" replace />} />
        <Route path="/print" element={<Navigate to="/app/print" replace />} />
        <Route path="/add_new_student" element={<Navigate to="/app/students/add" replace />} />
        <Route path="/edit" element={<Navigate to="/app/edit" replace />} />
        <Route path="/app/create-profile" element={<Navigate to="/create-profile" replace />} />

        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;