import { useQuery } from "@tanstack/react-query";
import { productKeys } from "../product.keys";
import type { ProductFilters } from "../types/product.types";
import { getData } from "../services/productApi";

export const useProducts = (
  page: number,
  pageSize: number,
  filters: ProductFilters,
) => {
  return useQuery({
    queryKey: productKeys.list(page,pageSize,filters),
    queryFn: () => getData(page,pageSize,filters),
    staleTime:60 * 1000,
  });
};