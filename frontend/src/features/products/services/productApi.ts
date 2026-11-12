import { apiClient } from "@/lib/api/apiClient";
import type {
  Product,
  ProductCreateRequest,
  ProductDeleteResponse,
  ProductFilters,
  ProductResponse,
  ProductUpdateRequest,
  ProductUpdateResponse,
} from "../types/product.types";

export const getCategory = async (): Promise<string[]> => {
  const response = await apiClient.get<string[]>("/Product/categories");
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
    params.set("search", filters.search.trim());
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

  const response = await apiClient.get<ProductResponse>(
    `/Product?${params.toString()}`,
  );

  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await apiClient.get<Product>(
    `/Product/${encodeURIComponent(id)}`,
  );

  return response.data;
};

export const updateProduct = async (
  id: string,
  updateData: ProductUpdateRequest,
): Promise<ProductUpdateResponse> => {
  const response = await apiClient.patch<ProductUpdateResponse>(
    `/Product/${encodeURIComponent(id)}`,
    updateData,
  );

  return response.data;
};

export const createProduct = async (
  productData: ProductCreateRequest,
): Promise<Product> => {
  const response = await apiClient.post<Product>("/Product/", productData);
  return response.data;
};
export const deleteProduct = async (
  id: string,
): Promise<ProductDeleteResponse> => {
  const response = await apiClient.delete<ProductDeleteResponse>(
    `/Product/${encodeURIComponent(id)}`,
  );

  return response.data;
};
