import type { LoginResponse } from "@/features/auth/types/auth.types";
import axios, { type AxiosError } from "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _accessToken?: string;
  }
}


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
export const getAccessToken = () => accessToken;

const expireSession = () => {
  setAccessToken(null);
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
};

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  config._accessToken = token ?? undefined;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export let refreshPromise: Promise<LoginResponse> | null = null;

export const refreshAccessToken = (): Promise<LoginResponse> => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<LoginResponse>(`${API_BASE_URL}/auth/refresh`, null, {
        withCredentials: true,
      })
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
    const isExcludedUrl = excludedUrls.some((url) => originalRequest.url?.includes(url));
  
    if (isExcludedUrl) {
      return Promise.reject(error);
    }
     originalRequest._retry = true;  // Another request may already have refreshed the token
    const currentToken = getAccessToken();

    if (
      originalRequest._accessToken &&
      originalRequest._accessToken !== currentToken &&
      currentToken
    ) {
      originalRequest.headers.Authorization = `Bearer ${currentToken}`;
      return apiClient(originalRequest);
    }

    try {
      const result = await refreshAccessToken();

      originalRequest.headers.Authorization =
        `Bearer ${result.accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      const status = axios.isAxiosError(refreshError)
        ? refreshError.response?.status
        : undefined;

      if (status === 401 || status === 403) {
        expireSession();
      }

      return Promise.reject(refreshError);
    }
  },
);
