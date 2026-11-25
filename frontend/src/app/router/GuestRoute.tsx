import { useAuth } from "@/features/auth/context/AuthContext";
import { Navigate, Outlet } from "react-router";

export const GuestRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if(isLoading){
    return <div>...Loading</div>
  }
  if(isAuthenticated && user){
    return (<Navigate to={user.role === "admin" ? "/admin" : "/"} replace={true}></Navigate>);
  }
  return <Outlet />;
};