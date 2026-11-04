import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateUserPRofile,
  type ApiUserRole,
  getCurrentUser,
  AUTH_SESSION_UPDATED_EVENT,
  AUTH_SESSION_EXPIRED_EVENT,
  waitForRefresh,
} from "../services/authApi";
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

type UpdateProfileData = Partial<Omit<User, "id">>;

type AuthSession = {
  user: User;
  accessToken: string;
  refreshToken: string | null;
};

type AuthContextType = {
  user: User | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  isAuthenticated: boolean;
};
const SESSION_KEY = "kinetic_auth_session";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeRole(role: ApiUserRole): UserRole {
  if (role === "Admin" || role === 1) return "admin";
  return "user";
}

function readSession(): AuthSession | null {
  try {
    const savedSession = sessionStorage.getItem(SESSION_KEY);
    if (!savedSession) return null;
    const session = JSON.parse(savedSession) as AuthSession;

    if (
      !session.user ||
      !session.accessToken ||
      typeof session.accessToken !== "string"
    ) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(() =>
    readSession(),
  );
  const queryClient = useQueryClient();
  const hydratedTokenRef = useRef<string | null>(null);
  const user = session?.user ?? null;
  const isAuthenticated = Boolean(session?.accessToken && user);

  useEffect(() => {
    const accessToken = session?.accessToken;
    if (!accessToken || hydratedTokenRef.current === accessToken) {
      return;
    }
    let cancelled = false;
    const loadCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (cancelled) return;
        const user: User = {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: normalizeRole(currentUser.role),
        };
        setSession((currentSession) => {
          if (!currentSession || currentSession.accessToken !== accessToken) {
            return currentSession;
          }
          return {
            ...currentSession,
            user,
          };
        });
        hydratedTokenRef.current = accessToken;
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load current user:", error);
        }
      }
    };

    loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, [session?.accessToken]);
  useEffect(() => {
    const handleSessionUpdated = () => {
      const updatedSession = readSession();

      if (!updatedSession) return;

      hydratedTokenRef.current = updatedSession.accessToken;
      setSession(updatedSession);
    };

    const handleSessionExpired = () => {
      hydratedTokenRef.current = null;
      queryClient.clear();
      setSession(null);
    };

    window.addEventListener(AUTH_SESSION_UPDATED_EVENT, handleSessionUpdated);

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(
        AUTH_SESSION_UPDATED_EVENT,
        handleSessionUpdated,
      );

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

    const temporarySession: AuthSession = {
      user: {
        id: "",
        name: "",
        email: response.email,
        role: normalizeRole(response.role),
      },
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(temporarySession));
    try {
      const currentUser = await getCurrentUser();

      const nextUser: User = {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: normalizeRole(currentUser.role),
      };

      hydratedTokenRef.current = response.accessToken;

      setSession({
        ...temporarySession,
        user: nextUser,
      });
      return nextUser;
    } catch (error) {
      sessionStorage.removeItem(SESSION_KEY);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    let refreshToken = session?.refreshToken;
    const savedSession = sessionStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        const storedSession = JSON.parse(savedSession) as AuthSession;
        refreshToken = storedSession.refreshToken;
      } catch (error) {
        console.error("Failed to read session during logout:", error);
      }
    }
    sessionStorage.removeItem(SESSION_KEY);
    hydratedTokenRef.current = null;
    queryClient.clear();
    setSession(null);
    try {
      // 3. Wait for an already-running refresh request.
      const refreshedSession = refreshToken ? await waitForRefresh(refreshToken) : null;

      // 4. Prefer the newly rotated refresh token if refresh succeeded.
      const tokenToRevoke = refreshedSession?.refreshToken ?? refreshToken;

      // 5. Revoke the latest available token on the backend.
      if (tokenToRevoke) {
        await logoutUser(tokenToRevoke);
      }
    } catch (error) {
      console.error("Backend logout failed:", error);
    }
  };

  const updateProfile = async (data: UpdateProfileData): Promise<void> => {
    if (!session) {
      throw new Error("You must be logged in to update your profile.");
    }

    await updateUserPRofile({
      name: data.name ?? session.user.name,
      email: data.email ?? session.user.email,
    });
    setSession((currentSession) => {
      if (!currentSession) return null;

      return {
        ...currentSession,
        user: {
          ...currentSession.user,
          ...data,
        },
      };
    });
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      register,
      login,
      logout,
      updateProfile,
      isAuthenticated,
    }),
    [user, isAuthenticated],
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
