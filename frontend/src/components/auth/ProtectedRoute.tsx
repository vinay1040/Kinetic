import { Navigate, Outlet } from "react-router";
import { useAuth, type UserRole } from "@/context/AuthContext";

type ProtectedRouteProps = {
  allowedRole?: UserRole; 
}

export const ProtectedRoute = ({allowedRole} : ProtectedRouteProps) => {
  const { user,isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if(allowedRole && user?.role !== allowedRole){
    return <Navigate to={"/"} replace/>
  }

  return <Outlet />;
};
