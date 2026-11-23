import {
  apiClient,
  refreshAccessToken,
} from "@/lib/api/apiClient";

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
    email: email.trim().toLowerCase(),
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

export const refreshSession = async (): Promise<LoginResponse> => {
  return refreshAccessToken();
};

export const logoutUser = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

export const updateUserProfile = async (
  profile: UpdateProfileRequest,
): Promise<void> => {
  await apiClient.put("/auth/updateProfile", profile);
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
