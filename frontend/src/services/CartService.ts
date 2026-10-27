import { AuthApi } from "./authApi";

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
    const response = await AuthApi.get<Cart>("/cart");
    return response.data;
};

export const addCartItem = async (request: CartItemRequest) : Promise<Cart> => {
    const response = await AuthApi.post<Cart>("/cart",request);
    return response.data;
};

export const updateCartItem = async (productId:string,request:UpdateCartQuantityRequest):Promise<Cart> => {
    const response = await AuthApi.put(`/cart/items/${encodeURIComponent(productId)}`,request);
    return response.data;
};

export const removeCartItem = async (productId:string) : Promise<Cart> => {
    const response = await AuthApi.delete<Cart>(`/cart/items/${encodeURIComponent(productId)}`);
    return response.data;
};

export const clearCart = async (): Promise<void> => {
  await AuthApi.delete("/cart");
}