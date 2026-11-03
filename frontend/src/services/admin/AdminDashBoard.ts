import { AuthApi } from "../authApi";
import type { Order } from "../Order";

export interface MonthlyRevenue {
  year: number;
  month: number;
  revenue: number;
}

export const getAllOrder = async (): Promise<Order[]> => {
  const response = await AuthApi.get("/Order/admin");
  return response.data;
};

export const getMonthlyRevenue = async (): Promise<MonthlyRevenue[]> => {
  const response = await AuthApi.get<MonthlyRevenue[]>(
    "/Order/admin/revenue/monthly",
  );

  return response.data;
};
