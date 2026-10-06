import axios from "axios";
// import { access } from "fs";
// import { stringify } from "querystring";
const API_BASE_URL = "http://localhost:5254/api";

export const AuthApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<LoginResponse> | null = null;

AuthApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response?.status !== 401 ||
      error.config?.url === "/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    const savedSession = localStorage.getItem("kinetic_auth_session");

    if (!savedSession) {
      return Promise.reject(error);
    }

    const session = JSON.parse(savedSession);

    if (!session.refreshToken) {
      return Promise.reject(error);
    }
    if (!refreshPromise) {
      refreshPromise = refreshUser(session.refreshToken);
    }
    try {
      const response = await refreshPromise;
      const newSession = {
        ...session,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };

      localStorage.setItem("kinetic_auth_session", JSON.stringify(newSession));

      error.config.headers.Authorization = `Bearer ${response.accessToken}`;
      return AuthApi(error.config);
    } catch (refreshError) {
      localStorage.removeItem("kinetic_auth_session");
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);

AuthApi.interceptors.request.use((config) => {
  const savedSession = localStorage.getItem("kinetic_auth_session");

  if (savedSession) {
    try {
      const session = JSON.parse(savedSession);
      const accessToken = session.accessToken;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error("Failed to read authentication session:", error);
    }
  }

  return config;
});

export type UpdateProfileRequest = {
  name: string;
  email: string;
};

export type ApiUserRole = "Customer" | "Admin" | 0 | 1;

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: ApiUserRole;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<void> => {
  await AuthApi.post("/auth/register", {
    name: name.trim(),
    email: email.trim().toLocaleLowerCase(),
    password,
  });
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const reponse = await AuthApi.post("/auth/login", { email, password });
  return reponse.data;
};
export const refreshUser = async (
  refreshToken: string,
): Promise<LoginResponse> => {
  const response = await AuthApi.post("/auth/refresh", { refreshToken });
  return response.data;
};

export const updateUserPRofile = async (
  id: string,
  profile: UpdateProfileRequest,
): Promise<void> => {
  await AuthApi.put(`/auth/updateProfile/${encodeURIComponent(id)}`, profile);
};
export const logoutUser = async (refreshToken: string): Promise<void> => {
  await AuthApi.post("/auth/logout", { refreshToken });
};
