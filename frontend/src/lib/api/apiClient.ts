import type { LoginResponse } from "@/features/auth/types/auth.types";
import axios from "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Keep the app renderable when the optional backend URL has not been set.
// In that case requests use the current origin and can be configured later
// without taking down the entire frontend during module initialization.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const AUTH_SESSION_UPDATED_EVENT = "kinetic:auth-session-updated";

export const AUTH_SESSION_EXPIRED_EVENT = "kinetic:auth-session-expired";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const savedSession = sessionStorage.getItem("kinetic_auth_session");
  if (savedSession) {
    try {
      const session = JSON.parse(savedSession);
      if (session.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch {
      sessionStorage.removeItem("kinetic_auth_session");
    }
  }
  return config;
});

const refreshPromises = new Map<string, Promise<LoginResponse>>();

const refreshToken = (token: string): Promise<LoginResponse> => {
  const existingPromise = refreshPromises.get(token);
  if (existingPromise) {
    return existingPromise;
  }
  let promise: Promise<LoginResponse>;
  const request = axios
    .post<LoginResponse>(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: token,
    })
    .then((response) => response.data);
  promise = request.finally(() => {
    if (refreshPromises.get(token) === promise) {
      refreshPromises.delete(token);
    }
  });
  refreshPromises.set(token, promise);
  return promise;
};

export const waitForRefresh = async (
  token: string,
): Promise<LoginResponse | null> => {
  const pendingRefresh = refreshPromises.get(token);

  if (!pendingRefresh) {
    return null;
  }

  try {
    return await pendingRefresh;
  } catch {
    return null;
  }
};
const getSavedSession = () => {
  const savedSession = sessionStorage.getItem("kinetic_auth_session");
  if (!savedSession) return null;
  try {
    return JSON.parse(savedSession) as LoginResponse;
  } catch {
    sessionStorage.removeItem("kinetic_auth_session");
    return null;
  }
};
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors.
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Don't retry the same request more than once.
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't attempt refresh for authentication endpoints.
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

    originalRequest._retry = true;

    const session = getSavedSession();

    if (!session?.refreshToken) {
      if (session) {
        sessionStorage.removeItem("kinetic_auth_session");
        window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
      }

      return Promise.reject(error);
    }

    let tokens: LoginResponse;

    // Step 1: Get new tokens.
    try {
      tokens = await refreshToken(session.refreshToken);
    } catch (refreshError) {
      // Only expire the session if it is still the same session.
      const latestSession = getSavedSession();

      if (latestSession?.refreshToken === session.refreshToken) {
        sessionStorage.removeItem("kinetic_auth_session");

        window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
      }

      return Promise.reject(refreshError);
    }

    // Step 2: Check whether the session changed while refreshing.
    const latestSession = getSavedSession();

    if (
      !latestSession ||
      (latestSession.refreshToken !== session.refreshToken &&
        latestSession.refreshToken !== tokens.refreshToken)
    ) {
      return Promise.reject(error);
    }

    // Step 3: Save the new tokens.
    const updatedSession = {
      ...latestSession,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };

    sessionStorage.setItem(
      "kinetic_auth_session",
      JSON.stringify(updatedSession),
    );

    window.dispatchEvent(new Event(AUTH_SESSION_UPDATED_EVENT));

    // Step 4: Retry the original request with the new access token.
    originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

    return apiClient(originalRequest);
  },
);
