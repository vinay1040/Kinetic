import { apiClient } from "@/lib/api/apiClient";

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  id?: string;
  userId?: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
};

export interface CartItemRequest {
  productId: string;
  quantity: number;
};

export interface UpdateCartQuantityRequest {
  quantity: number;
};

export const getCart = async () : Promise<Cart> => {
    const response = await apiClient.get<Cart>("/cart");
    return response.data;
};

export const addCartItem = async (request: CartItemRequest) : Promise<Cart> => {
    const response = await apiClient.post<Cart>("/cart",request);
    return response.data;
};

export const updateCartItem = async (productId:string,request:UpdateCartQuantityRequest):Promise<Cart> => {
    const response = await apiClient.put(`/cart/items/${encodeURIComponent(productId)}`,request);
    return response.data;
};

export const removeCartItem = async (productId:string) : Promise<Cart> => {
    const response = await apiClient.delete<Cart>(`/cart/items/${encodeURIComponent(productId)}`);
    return response.data;
};

export const clearCart = async (): Promise<void> => {
  await apiClient.delete("/cart");
}