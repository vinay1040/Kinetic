import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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

type StoredUser = User & {
  password: string;
};

type UpdateProfileData = Partial<Omit<User, "id">>;

type AuthContextType = {
  user: User | null;
  register: (
    name: string,
    email: string,
    password: string,
  ) => boolean;
  login: (
    email: string,
    password: string,
  ) => boolean;
  logout: () => void;
  updateProfile: (
    data: UpdateProfileData,
  ) => void;
  isAuthenticated: boolean;
};


const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);


export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {


  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("users");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser) as User;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });


  const getStoredUsers = (): StoredUser[] => {
    const savedUsers = localStorage.getItem("users");

    if (!savedUsers) {
      return [];
    }

    try {
      return JSON.parse(savedUsers) as StoredUser[];
    } catch {
      localStorage.removeItem("users");
      return [];
    }
  };

  useEffect(() => {
    const users = getStoredUsers();

    const adminExists = users.some(
      (user) => user.role === "admin",
    );

    if (!adminExists) {
      const adminUser: StoredUser = {
        id: crypto.randomUUID(),
        name: "Admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      };

      users.push(adminUser);

      localStorage.setItem(
        "users",
        JSON.stringify(users),
      );
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify(user),
      );
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const register = (
    name: string,
    email: string,
    password: string,
  ): boolean => {
    const users = getStoredUsers();

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const existingUser = users.find(
      (user) => user.email === normalizedEmail,
    );

    if (existingUser) {
      return false;
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "user",
    };

    users.push(newUser);

    localStorage.setItem(
      "users",
      JSON.stringify(users),
    );

    return true;
  };

  const login = (
    email: string,
    password: string,
  ): boolean => {
    const users = getStoredUsers();

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const foundUser = users.find(
      (user) =>
        user.email === normalizedEmail &&
        user.password === password,
    );

    if (!foundUser) {
      return false;
    }

    setUser({
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      address: foundUser.address,
    });

    return true;
  };

  const logout = () => {
    setUser(null);
  };

 
  const updateProfile = (
    data: UpdateProfileData,
  ) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return null;
      }

      const updatedUser: User = {
        ...currentUser,
        ...data,
      };

      const users = getStoredUsers();

      const updatedUsers = users.map(
        (storedUser) => {
          if (storedUser.id !== currentUser.id) {
            return storedUser;
          }

          return {
            ...storedUser,
            ...data,
          };
        },
      );

      localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers),
      );

      return updatedUser;
    });
  };


  const isAuthenticated = user !== null;


  const value = useMemo(
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
};
