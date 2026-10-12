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
export type ProductUpdateRequest = Partial<
  Pick<
    Product,
    | "title"
    | "description"
    | "price"
    | "discountPercentage"
    | "category"
    | "stock"
    | "brand"
    | "thumbnail"
    | "images"
  >
>;
export interface ProductUpdateResponse {
  status: number;
  message: string;
  modified: boolean;
}
export const getData = async (
  page: number,
  pageSize: number,
): Promise<ProductResponse> => {
  const response = await AuthApi.get<ProductResponse>(
    `/Product?page=${page}&pageSize=${pageSize}`,
  );
  return response.data;
};
export const getProductById = async (id: string) => {
  const response = await AuthApi.get<Product>(
    `/Product/${encodeURIComponent(id)}`,
  );
  return response.data;
};
export const updateProduct = async (
  id: string,
  updateData: ProductUpdateRequest,
): Promise<ProductUpdateResponse> => {
  const response = await AuthApi.patch<ProductUpdateResponse>(
    `/Product/${encodeURIComponent(id)}`,
    updateData,
  );

  return response.data;
};
