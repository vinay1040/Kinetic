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
export interface ProductResponse {
  products: Product[];
  page: number;
  pageSize: number;
  totalProducts: number;
  totalPages: number;
}

export interface Product {
  id: string;
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
export const getData = async (page : number ,pageSize : number): Promise<ProductResponse> => {
  const response = await AuthApi.get<ProductResponse>(`/Product?page=${page}&pageSize=${pageSize}`);
  return response.data;
};
export const getProductById = async (id: string) => {
  const response = await AuthApi.get<Product>(
    `/Product/${encodeURIComponent(id)}`,
  );

  return response.data;
};
