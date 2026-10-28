import type { ProductFilters } from "@/context/ProductContext";
import { AuthApi } from "./authApi";

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
export const getCategory = async (): Promise<string[]> => {
  const response = await AuthApi.get<string[]>("/Product/categories");
  return response.data;
};
export const getData = async (
  page: number,
  pageSize: number,
  filters: ProductFilters = {},
): Promise<ProductResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (filters.search?.trim()) {
    params.set("search", filters.search?.trim());
  }
  (filters.categories ?? []).forEach((category) => {
    params.append("categories", category);
  });
  if (filters.minPrice !== undefined) {
    params.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice !== undefined) {
    params.set("maxPrice", String(filters.maxPrice));
  }
  if (filters.minRating !== undefined && filters.minRating > 0) {
    params.set("minRating", String(filters.minRating));
  }
  if (filters.sortBy) {
    params.set("sortBy", filters.sortBy);
  }
  if (filters.sortOrder) {
    params.set("sortOrder", filters.sortOrder);
  }
  const response = await AuthApi.get<ProductResponse>(
    `/Product?${params.toString()}`,
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
