import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  refreshSession,
} from "../services/authApi";

import type { ApiUserRole, UserProfileResponse } from "../types/auth.types";

import {
  AUTH_SESSION_EXPIRED_EVENT,
  setAccessToken,
} from "@/lib/api/apiClient";
import { useQueryClient } from "@tanstack/react-query";

type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

export type UserRole = "user" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  address?: Address;
};

type UpdateProfileData = {
  name?: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeRole(role: ApiUserRole): UserRole {
  if (role === "Admin" || role === 1) return "admin";
  return "user";
}
function mapUser(response: UserProfileResponse): User {
  return {
    id: response.id,
    name: response.name,
    email: response.email,
    role: normalizeRole(response.role),
  };
}



export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const isAuthenticated = Boolean(user);

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const response = await refreshSession();

        if (cancelled) return;

        setAccessToken(response.accessToken);
        setUser(mapUser(response.user));
      } catch {
        if (!cancelled) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    const handleSessionExpired = () => {
      setAccessToken(null);
      setUser(null);
      queryClient.clear();
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(
        AUTH_SESSION_EXPIRED_EVENT,
        handleSessionExpired,
      );
    };
  }, [queryClient]);
  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<void> => {
    await registerUser(name, email, password);
  };

  const login = async (email: string, password: string): Promise<User> => {
    const response = await loginUser(email.trim().toLowerCase(), password);
    setAccessToken(response.accessToken);
    const loggedUser = mapUser(response.user);
    setUser(loggedUser);
    return loggedUser;
  };

  const logout = async (): Promise<void> => {
    setAccessToken(null);
    setUser(null);
    queryClient.clear();
    try {
      await logoutUser();
    } catch (error) {
      console.error("Backend failed logout", error);
    }
  };

  const updateProfile = async (data: UpdateProfileData): Promise<void> => {
    if (!user) {
      throw new Error("You must be logged in to update your profile.");
    }

    const updatedUser = {
      name: data.name ?? user.name,
      email: data.email ?? user.email,
    };
    await updateUserProfile(updatedUser);
    setUser((currentUser) =>
      currentUser
        ? {
            ...currentUser,
            ...updatedUser,
          }
        : null,
    );
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      register,
      login,
      logout,
      updateProfile,
      isAuthenticated,
      isLoading,
    }),
    [user, isAuthenticated, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
