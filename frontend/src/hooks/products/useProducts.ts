import { useQuery } from "@tanstack/react-query";
import { productKeys } from "../../features/products/product.keys";
import type { ProductFilters } from "../../features/products/types/product.types";
import { getData } from "../../Services/productApi";

export const useProducts = (
  page: number,
  pageSize: number,
  filters: ProductFilters,
) => {
  return useQuery({
    queryKey: productKeys.list(page, pageSize, filters),
    queryFn: () => getData(page, pageSize, filters),
    staleTime: 60 * 1000,
  });
};
