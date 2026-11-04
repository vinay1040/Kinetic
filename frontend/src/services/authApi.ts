import axios from "axios";
export const AUTH_SESSION_UPDATED_EVENT = "kinetic:auth-session-updated";

export const AUTH_SESSION_EXPIRED_EVENT = "kinetic:auth-session-expired";
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}
const API_BASE_URL = "http://localhost:5254/api";
export type UpdateProfileRequest = {
  name: string;
  email: string;
};

export type ApiUserRole = "Customer" | "Admin" | 0 | 1;
export type UserProfileResponse = {
  id: string;
  name: string;
  email: string;
  role: ApiUserRole;
};
export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: ApiUserRole;
};

export const AuthApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<LoginResponse> | null = null;

AuthApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const excludedUrls = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/auth/logout",
    ];

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      excludedUrls.some((url) => originalRequest.url?.includes(url))
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const savedSession = sessionStorage.getItem("kinetic_auth_session");

    if (!savedSession) {
      window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
      return Promise.reject(error);
    }

    let session: LoginResponse & {
      user: UserProfileResponse | Record<string, unknown>;
    };

    try {
      session = JSON.parse(savedSession);
    } catch {
      sessionStorage.removeItem("kinetic_auth_session");

      window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));

      return Promise.reject(error);
    }

    if (!session.refreshToken) {
      sessionStorage.removeItem("kinetic_auth_session");

      window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));

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

      sessionStorage.setItem(
        "kinetic_auth_session",
        JSON.stringify(newSession),
      );

      // Notify AuthContext that the tokens have changed.
      window.dispatchEvent(new Event(AUTH_SESSION_UPDATED_EVENT));

      originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;

      return AuthApi(originalRequest);
    } catch (refreshError) {
      sessionStorage.removeItem("kinetic_auth_session");

      // Notify AuthContext that authentication has expired.
      window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));

      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);

AuthApi.interceptors.request.use((config) => {
  const savedSession = sessionStorage.getItem("kinetic_auth_session");

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
  profile: UpdateProfileRequest,
): Promise<void> => {
  await AuthApi.put("/auth/updateProfile", profile);
};
export const logoutUser = async (refreshToken: string): Promise<void> => {
  await AuthApi.post("/auth/logout", { refreshToken });
};

export const getCurrentUser = async (): Promise<UserProfileResponse> => {
  const response = await AuthApi.get<UserProfileResponse>("/auth/me");
  return response.data;
};
