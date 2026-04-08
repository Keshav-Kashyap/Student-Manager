import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import FlashMessageProvider from "./components/common/FlashMessageProvider";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ConfirmDialogProvider } from "./context/ConfirmDialogContext";
import AdminLayout from "./Layouts/AdminLayout";
import AuthenticatedLayout from "./Layouts/AuthenticatedLayout";
import { UserManager } from "./Utils/UserManager";
import Dashboard2 from "./app/dashboard/Dashboard2";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const Help = lazy(() => import("./pages/Help"));
const About = lazy(() => import("./pages/About"));
const GoogleRedirect = lazy(() => import("./pages/Auth/Google-redirect"));
const VerifyEmailPage = lazy(() => import("./pages/Auth/EmailConfirmation"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudentList = lazy(() => import("./pages/StudentList"));
const AddStudentPage = lazy(() => import("./pages/AddStudentPage"));
const EditStudentPage = lazy(() => import("./pages/EditStudentPage"));
const ViewStudentIDCardPage = lazy(() => import("./pages/ViewStudent"));
const PrintIDCard = lazy(() => import("./pages/PrintIDCard"));
const Admindashboard = lazy(() => import("./pages/Admindashboard"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const UserDetailedPage = lazy(() => import("./pages/UserDetailedPage"));
const AdminViewStudent = lazy(() => import("./pages/AdminViewStudent"));
const PageNotFound = lazy(() => import("./pages/page404"));
const Chat = lazy(() => import("./pages/Chat"));

const RouteShellFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" />
);

// Helper component to check if user is logged in and route accordingly
const ConditionalRoute = ({ component: Component, authPath }) => {
  const isLoggedIn = UserManager.getSavedUser();

  if (isLoggedIn) {
    return <Navigate to={authPath} replace />;
  }

  return (
    <Suspense fallback={<RouteShellFallback />}>
      {React.createElement(Component)}
    </Suspense>
  );
};

const LazyElement = ({ component: Component }) => (
  <Suspense fallback={<RouteShellFallback />}>
    {React.createElement(Component)}
  </Suspense>
);

const EditStudentLegacyRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/app/students/edit/${id}`} replace />;
};

function App() {
  return (
    <>
      <FlashMessageProvider />
      <ConfirmDialogProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LazyElement component={LandingPage} title="Loading Home..." />} />
          <Route path="/login" element={<LazyElement component={Login} title="Loading Login..." />} />
          <Route path="/signup" element={<LazyElement component={Signup} title="Loading Signup..." />} />
          <Route
            path="dashboard2"
            element={<LazyElement component={Dashboard2} title="Loading Admin Dashboard..." />}
          />
          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route
                path="dashboard"
                element={<LazyElement component={Admindashboard} title="Loading Admin Dashboard..." />}
              />

              <Route
                path="users"
                element={<LazyElement component={UserManagement} title="Loading Users..." />}
              />
              <Route
                path="users/:id"
                element={<LazyElement component={UserDetailedPage} title="Loading User Details..." />}
              />
              <Route
                path="student/view/:id"
                element={<LazyElement component={AdminViewStudent} title="Loading Student..." />}
              />
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

          <Route
            path="/google-redirect"
            element={<LazyElement component={GoogleRedirect} title="Signing you in..." />}
          />
          <Route
            path="/verify-email"
            element={<LazyElement component={VerifyEmailPage} title="Verifying Email..." />}
          />
          <Route
            path="/verify-email-cheak"
            element={<LazyElement component={VerifyEmailPage} title="Verifying Email..." />}
          />
          <Route
            path="/forgot-password"
            element={<LazyElement component={ForgotPassword} title="Loading Password Reset..." />}
          />
          <Route
            path="/reset-password"
            element={<LazyElement component={ResetPassword} title="Loading Reset Form..." />}
          />
          <Route
            path="/create-profile"
            element={<LazyElement component={EditProfile} title="Loading Profile..." />}
          />

          {/* Protected Teacher Routes */}
          <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
            <Route path="/app" element={<AuthenticatedLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route
                path="dashboard"
                element={<LazyElement component={Dashboard} title="Loading Dashboard..." />}
              />
              <Route
                path="dashboard2"
                element={<LazyElement component={Dashboard2} title="Loading Dashboard 2..." />}
              />
              <Route
                path="students"
                element={<LazyElement component={StudentList} title="Loading Students..." />}
              />
              <Route
                path="students/add"
                element={<LazyElement component={AddStudentPage} title="Loading Add Student..." />}
              />
              <Route
                path="students/edit/:id"
                element={<LazyElement component={EditStudentPage} title="Loading Edit Student..." />}
              />
              <Route
                path="student/view/:id"
                element={<LazyElement component={ViewStudentIDCardPage} title="Loading Student View..." />}
              />
              <Route
                path="print"
                element={<LazyElement component={PrintIDCard} title="Loading Print..." />}
              />
              <Route path="help" element={<LazyElement component={Help} title="Loading Help..." />} />
              <Route path="about" element={<LazyElement component={About} title="Loading About..." />} />
              <Route
                path="edit"
                element={<LazyElement component={EditProfile} title="Loading Profile..." />}
              />
            </Route>
          </Route>

          {/* Redirects */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/dashboard2" element={<Navigate to="/app/dashboard2" replace />} />
          <Route path="/students" element={<Navigate to="/app/students" replace />} />
          <Route path="/print" element={<Navigate to="/app/print" replace />} />
          <Route path="/add_new_student" element={<Navigate to="/app/students/add" replace />} />
          <Route path="/edit" element={<Navigate to="/app/edit" replace />} />
          <Route path="/app/create-profile" element={<Navigate to="/create-profile" replace />} />
          <Route path="/edit_student/:id" element={<EditStudentLegacyRedirect />} />
          <Route path="/app/edit_student/:id" element={<EditStudentLegacyRedirect />} />
          <Route path="/app/student/edit/:id" element={<EditStudentLegacyRedirect />} />

          {/* 404 */}
          <Route path="*" element={<LazyElement component={PageNotFound} title="Loading Page..." />} />
        </Routes>
      </ConfirmDialogProvider>
    </>
  );
}

export default App;