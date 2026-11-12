import { apiClient } from "@/lib/api/apiClient";

import type {
  ChangePasswordRequest,
  LoginResponse,
  UpdateProfileRequest,
  UserProfileResponse,
} from "../types/auth.types";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<void> => {
  await apiClient.post("/auth/register", {
    name: name.trim(),
    email: email.trim().toLocaleLowerCase(),
    password,
  });
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const updateUserProfile = async (
  profile: UpdateProfileRequest,
): Promise<void> => {
  await apiClient.put("/auth/updateProfile", profile);
};

export const logoutUser = async (
  refreshToken: string,
): Promise<void> => {
  await apiClient.post("/auth/logout", { refreshToken });
};

export const getCurrentUser = async (): Promise<UserProfileResponse> => {
  const response =
    await apiClient.get<UserProfileResponse>("/auth/me");

  return response.data;
};

export const changePassword = async (
  data: ChangePasswordRequest,
): Promise<void> => {
  await apiClient.put("/auth/change-password", data);
};