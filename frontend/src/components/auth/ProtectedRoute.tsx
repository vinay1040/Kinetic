import { Navigate, Outlet } from "react-router";
import { useAuth, type UserRole } from "@/context/AuthContext";

type ProtectedRouteProps = {
  allowedRole?: UserRole; 
}

const DEV_MODE = true;

export const ProtectedRoute = ({allowedRole} : ProtectedRouteProps) => {
  const { user,isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if(!DEV_MODE && allowedRole && user?.role !== allowedRole){
    return <Navigate to={"/"} replace/>
  }

  return <Outlet />;
};
