import { AuthApi } from "../authApi";
import type { Order } from "../Order";

export interface AdminDashboard {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export interface MonthlyRevenue {
  year: number;
  month: number;
  revenue: number;
}

export const getAllOrder = async (): Promise<Order[]> => {
  const response = await AuthApi.get("/Order/admin");
  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await AuthApi.get<AdminDashboard>("/Order/admin/dashboard");
  return response.data;
};

export const getMonthlyRevenue = async (): Promise<MonthlyRevenue[]> => {
  const response = await AuthApi.get<MonthlyRevenue[]>(
    "/Order/admin/revenue/monthly",
  );

  return response.data;
};
