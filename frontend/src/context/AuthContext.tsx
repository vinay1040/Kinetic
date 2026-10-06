import {
  Children,
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
  updateUserPRofile,
  type ApiUserRole,
} from "../services/authApi";
import { User } from "lucide-react";

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
  updateProfile: (data: UpdateProfileData) => void;
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
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (!savedSession) return null;
    const session = JSON.parse(savedSession) as AuthSession;

    if (
      !session.user ||
      !session.accessToken ||
      typeof session.accessToken !== "string"
    ) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(() =>
    readSession(),
  );

  const user = session?.user ?? null;
  const isAuthenticated = Boolean(session?.accessToken && user);

  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [session]);

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<void> => {
    await registerUser(name, email, password);
  };

  const login = async (email: string, password: string): Promise<User> => {
    const response = await loginUser(email.trim().toLowerCase(), password);

    const nextUser: User = {
      id: "",
      name: response.email.split("@")[0],
      email: response.email,
      role: normalizeRole(response.role),
    };

    setSession({
      user: nextUser,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken ?? null,
    });

    return nextUser;
  };

  const logout = async (): Promise<void> => {
    const refreshToken = session?.refreshToken;
    setSession(null);
    if (refreshToken) {
      try {
        await logoutUser(refreshToken);
      } catch (error) {
        console.error("Backend logout failed:", error);
      }
    }
  };

  const updateProfile = async (data: UpdateProfileData): Promise<void> => {
    if (!session) {
      throw new Error("You must be logged in to update your profile.");
    }

    await updateUserPRofile(session.user.id, {
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
