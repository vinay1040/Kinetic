import type { LoginResponse } from "@/features/auth/types/auth.types";
import axios, { type AxiosError } from "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _accessToken?: string;
  }
}

const SESSION_KEY = "kinetic_auth_session";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured.");
}

export const AUTH_SESSION_EXPIRED_EVENT = "kinetic:auth-session-expired";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const expireSession = () => {
  setAccessToken(null);
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
};

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
let refreshPromise: Promise<LoginResponse> | null = null;

const refreshAccessToken = (): Promise<LoginResponse> => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<LoginResponse>(`${API_BASE_URL}/auth/refresh`,null,{withCredentials: true})
      .then((response) => response.data)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const excludedUrls = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/auth/logout",
    ];

    const isExcludedUrl = excludedUrls.some((url) =>
      originalRequest.url?.includes(url),
    );

    if (isExcludedUrl) {
      return Promise.reject(error);
    }

    const session = getSavedSession();

    if (!session?.refreshToken) {
      if (session) {
        expireSession();
      }

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (
      originalRequest._accessToken &&
      originalRequest._accessToken !== session.accessToken
    ) {
      originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;

      return apiClient(originalRequest);
    }

    try {
      const tokens = await refreshAccessToken(session.refreshToken);

      const latestSession = getSavedSession();

      if (
        !latestSession ||
        latestSession.refreshToken !== session.refreshToken
      ) {
        return Promise.reject(error);
      }

      const updatedSession = {
        ...latestSession,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));

      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      const status = axios.isAxiosError(refreshError)
        ? refreshError.response?.status
        : undefined;

      if (status === 401 || status === 403) {
        const latestSession = getSavedSession();

        if (latestSession?.refreshToken === session.refreshToken) {
          expireSession();
        }
      }

      return Promise.reject(refreshError);
    }
  },
);
