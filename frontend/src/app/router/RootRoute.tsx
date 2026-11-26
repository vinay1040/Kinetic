import { useAuth } from "@/features/auth/context/AuthContext";
import Home from "@/pages/Home";
import { Navigate } from "react-router";

export const RootRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div>...Loading</div>;
  }
  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to={"/admin"} replace />;
  }
  return <Home />;
};
