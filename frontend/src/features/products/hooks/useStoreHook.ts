import { useEffect, useMemo, useState } from "react";
import { useProduct } from "../context/ProductContext";
import { useDebounce } from "use-debounce";
import { useProducts } from "./useProducts";

export const useStoreHook = () => {
  const { filters } = useProduct();
  const [page, setPage] = useState(1);
  const pageSize = 40;

  const [debouncedSearch] = useDebounce(filters.search ?? "", 500);
  const priceRange = useMemo(
    () => ({
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    }),
    [filters.minPrice, filters.maxPrice],
  );
  const [debouncededPriceRange] = useDebounce(priceRange, 500);
  useEffect(() => {
    setPage(1);
  }, [filters]);
  const queryfilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch.trim(),
      minPrice: debouncededPriceRange.minPrice,
      maxPrice: debouncededPriceRange.maxPrice,
    }),
    [filters, debouncedSearch, debouncededPriceRange],
  );
  const query = useProducts(page, pageSize, queryfilters);
  return {
    products: query.data?.products ?? [],
    totalProducts: query.data?.totalProducts ?? 0,
    totalPages: query.data?.totalPages ?? 0,

    page,
    pageSize,
    setPage,

    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
