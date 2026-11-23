import { Navigate, Outlet } from "react-router";
import { useAuth, type UserRole } from "@/features/auth/context/AuthContext";

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
    return <Navigate to={"/"} replace />;
  }

  return <Outlet />;
};
