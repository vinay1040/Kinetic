import { Navigate, Outlet } from "react-router";
import { useAuth, type UserRole } from "@/features/auth/context/AuthContext";
import { getDefaultRoute } from "./RoutePaths";

type ProtectedRouteProps = {
  allowedRole?: UserRole;
};

export const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if(isLoading){
    return <div>Loading...</div>
  }
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  return <Outlet />;
};
