
import type { UserRole } from "@/features/auth/context/AuthContext";

export const getDefaultRoute = (role: UserRole): string => {
  return role === "admin" ? "/admin" : "/";
};

export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signUp",
  admin: "/admin",
};