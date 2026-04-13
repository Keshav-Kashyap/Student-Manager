import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import SurajPrintingLoader from "./loader";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const role = user?.role || null;
  const isAppRoute = allowedRoles?.includes("teacher");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SurajPrintingLoader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!role && !isAppRoute) {
    return <Navigate to="/login" replace />;
  }

  if (isAppRoute) {
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
  }

  if (!allowedRoles.includes(role)) {
    return role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;