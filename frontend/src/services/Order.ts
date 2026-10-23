import { AuthApi } from "./authApi";

export interface OrderItem {
  productId: string;
  productTitle: string;
  thumbnail: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  shippingAddressId: string;
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
}

export const createOrder = async (
    request : CreateOrderRequest
) => {
    const response = await AuthApi.post<CreateOrderRequest>("/Order",request);
    return response.data;
};

export const getOrderData = async (): Promise<Order[]> => {
  const response = await AuthApi.get<Order[]>("/Order");
  return response.data;
}

export const getOrderById = async (id:string) => {
    const response = await AuthApi.get(`Order/${encodeURIComponent(id)}`);
    return response.data;
}