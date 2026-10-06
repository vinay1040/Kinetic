import { AuthApi } from "./authApi";

export const categories = [
  "laptops",
  "smartphones",
  "tablets",
  "mobile-accessories",
  "smartwatches",
  "gaming",
  "monitors",
  "computer-accessories",
  "headphones",
  "speakers",
  "cameras",
];

export interface Product {
  id: string;
  dummyJsonId?: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
}
export const getData = async (): Promise<Product[]> => {
  const response = await AuthApi.get<Product[]>("/Product");
  return response.data;
};  
export const getProductById = async (id: string) => {
  const response = await AuthApi.get<Product>(`/Product/${encodeURIComponent(id)}`);
  
  return response.data;
};
