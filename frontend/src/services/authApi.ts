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

const refreshPromises = new Map<string, Promise<LoginResponse>>();
//let refreshPromise: Promise<LoginResponse> | null = null;
// let refreshTokenInFlight: string | null = null;

export const waitForRefresh = async (
  refreshToken: string,
): Promise<LoginResponse | null> => {
  const pendingRefresh = refreshPromises.get(refreshToken);

  if (!pendingRefresh) {
    return null;
  }

  try {
    return await pendingRefresh;
  } catch {
    return null;
  }
};

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
    const currentRefreshPromise = getSharedRefresh(session.refreshToken);
    try {
      const response = await currentRefreshPromise;
      // Check whether the session still exists.
      const latestSavedSession = sessionStorage.getItem("kinetic_auth_session");
      if (!latestSavedSession) {
        return Promise.reject(error);
      }
      // Check whether this refresh result belongs to the current session.
      const latestSession = JSON.parse(latestSavedSession);
      if (latestSession.refreshToken !== response.refreshToken) {
        return Promise.reject(error);
      }
      // Retry the original request with the new access token.
      originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
      return AuthApi(originalRequest);
    } catch (refreshError) {
      // Read the session that currently exists.
      const latestSavedSession = sessionStorage.getItem("kinetic_auth_session");
      if (latestSavedSession) {
        try {
          const latestSession = JSON.parse(latestSavedSession);
          // Only expire the session that originally started this refresh.
          const isSameSession =
            latestSession.refreshToken === session.refreshToken;
          if (isSameSession) {
            sessionStorage.removeItem("kinetic_auth_session");
            // Notify AuthContext that authentication has expired.
            window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
          }
        } catch (parseError) {
          console.error("Failed to check the current session:", parseError);
        }
      }
      return Promise.reject(refreshError);
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
const getSharedRefresh = (refreshToken: string): Promise<LoginResponse> => {
  // Reuse an existing refresh request for this token.
  const existingPromise = refreshPromises.get(refreshToken);

  if (existingPromise) {
    return existingPromise;
  }

  // Start a new refresh operation.
  const currentPromise = (async () => {
    const response = await refreshUser(refreshToken);

    const latestSavedSession = sessionStorage.getItem("kinetic_auth_session");

    // Do not restore a session after logout.
    if (!latestSavedSession) {
      return response;
    }

    const latestSession = JSON.parse(latestSavedSession);

    const isSameSession = latestSession.refreshToken === refreshToken;

    const isAlreadyRefreshed =
      latestSession.refreshToken === response.refreshToken;

    // Do not overwrite another login session.
    if (!isSameSession && !isAlreadyRefreshed) {
      return response;
    }

    const updatedSession = {
      ...latestSession,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    };

    sessionStorage.setItem(
      "kinetic_auth_session",
      JSON.stringify(updatedSession),
    );

    window.dispatchEvent(new Event(AUTH_SESSION_UPDATED_EVENT));

    return response;
  })();

  refreshPromises.set(refreshToken, currentPromise);

  const clearRefreshState = () => {
    // Delete only this operation, not another refresh.
    if (refreshPromises.get(refreshToken) === currentPromise) {
      refreshPromises.delete(refreshToken);
    }
  };

  currentPromise.then(clearRefreshState, clearRefreshState);

  return currentPromise;
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
