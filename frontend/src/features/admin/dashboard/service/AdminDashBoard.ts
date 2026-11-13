import { apiClient } from "@/lib/api/apiClient";
import type { Order } from "../../../orders/services/Order";

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
export interface CategoryRevenue {
  category: string;
  revenue: number;
  percentage: number;
}
export const getAllOrder = async (): Promise<Order[]> => {
  const response = await apiClient.get("/Order/admin");
  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await apiClient.get<AdminDashboard>(
    "/Order/admin/dashboard",
  );
  return response.data;
};

export const getMonthlyRevenue = async (): Promise<MonthlyRevenue[]> => {
  const response = await apiClient.get<MonthlyRevenue[]>(
    "/Order/admin/revenue/monthly",
  );

  return response.data;
};

export const getCategoriesRevenue = async () => {
  const response = await apiClient.get<CategoryRevenue[]>(
    "/Order/admin/revenue/categories",
  );
  return response.data;
};
