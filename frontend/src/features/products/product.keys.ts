import type { ProductFilters } from "./types/product.types";

export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,

  list: (
    page: number,
    pageSize: number,
    filters: ProductFilters,
  ) => [...productKeys.lists(), { page, pageSize, filters }] as const,

  details: () => [...productKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...productKeys.details(), id] as const,

  categories: () => [...productKeys.all, "categories"] as const,
};