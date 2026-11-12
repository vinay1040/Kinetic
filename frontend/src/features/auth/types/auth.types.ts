export type UpdateProfileRequest = {
  name: string;
  email: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
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