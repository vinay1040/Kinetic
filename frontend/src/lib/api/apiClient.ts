import type { LoginResponse } from "@/features/auth/types/auth.types";
import axios, { type AxiosError } from "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}
type StoredAuthSession = {
  accessToken: string;
  refreshToken: string | null;
  [key: string]: unknown;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured.");
}
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
    return JSON.parse(savedSession) as StoredAuthSession;
  } catch {
    sessionStorage.removeItem("kinetic_auth_session");
    return null;
  }
};
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }
    if (originalRequest._retry) {
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
    try {
      tokens = await refreshToken(session.refreshToken);
    } catch (refreshError) {
      const status = axios.isAxiosError(refreshError)
        ? refreshError.response?.status
        : undefined;

      if (status === 401 || status === 403) {
        const latestSession = getSavedSession();

        if (latestSession?.refreshToken === session.refreshToken) {
          sessionStorage.removeItem("kinetic_auth_session");

          window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
        }
      }
      return Promise.reject(refreshError);
    }

    const latestSession = getSavedSession();

    if (
      !latestSession ||
      (latestSession.refreshToken !== session.refreshToken &&
        latestSession.refreshToken !== tokens.refreshToken)
    ) {
      return Promise.reject(error);
    }

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

    originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

    return apiClient(originalRequest);
  },
);
