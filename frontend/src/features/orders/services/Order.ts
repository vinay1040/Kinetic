import { apiClient } from "@/lib/api/apiClient";
import type {
  CancelOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  Order,
} from "../types/Order.types";

export const createOrder = async (
  request: CreateOrderRequest,
): Promise<CreateOrderResponse> => {
  const response = await apiClient.post<CreateOrderResponse>("/Order", request);

  return response.data;
};

export const getOrderData = async (): Promise<Order[]> => {
  const response = await apiClient.get<Order[]>("/Order");
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await apiClient.get(`Order/${encodeURIComponent(id)}`);
  return response.data;
};

export const cancelOrder = async (id: string): Promise<CancelOrderResponse> => {
  const response = await apiClient.post(
    `/Order/${encodeURIComponent(id)}/cancel`,
  );
  return response.data;
};


