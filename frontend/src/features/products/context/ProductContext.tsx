import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import type { Product, ProductFilters } from "../types/product.types";
import { productKeys } from "../product.keys";
import { getData } from "../services/productApi";
export type ProductSortBy = "price" | "rating" | "title";
export type SortOrder = "asc" | "desc";
type ProductContextType = {
  products: Product[];
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
  page: number;
  pageSize: number;
  totalPages: number;
  totalProducts: number;
  setPage: (page: number) => void;
  loading: boolean;
  error: string | null;
};

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [page, setPage] = useState(1);
  const pageSize = 40;
  const [filters, setFilters] = useState<ProductFilters>({});
  const updateFilter = (newFilter: React.SetStateAction<ProductFilters>) => {
    setFilters(newFilter);
    setPage(1);
  };
  const [debouncedSearch] = useDebounce(filters.search ?? "", 500);
  const priceRange = useMemo(
    () => ({
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    }),
    [filters.minPrice, filters.maxPrice],
  );
  const [debouncePriceRange] = useDebounce(priceRange, 500);
  const queryFilters = useMemo<ProductFilters>(
    () => ({
      ...filters,
      search: debouncedSearch.trim() || "",
      minPrice: debouncePriceRange.minPrice,
      maxPrice: debouncePriceRange.maxPrice,
    }),
    [filters, debouncedSearch, debouncePriceRange],
  );
 
  const { data, isError, isPending } = useQuery({
    queryKey: productKeys.list(page, pageSize, queryFilters),
    queryFn: () => getData(page, pageSize, queryFilters),
    staleTime: 60 * 1000,
  });
  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalProducts = data?.totalProducts ?? 0;
  const error = isError ? "Unable to load products. Please try again." : null;
  return (
    <ProductContext.Provider
      value={{
        products,
        page,
        filters,
        setFilters: updateFilter,
        pageSize,
        totalPages,
        totalProducts,
        setPage,
        loading: isPending,
        error,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);

  if (context === null) {
    throw new Error("useProduct must be used inside ProductProvider");
  }

  return context;
};
