import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useDebounce } from "use-debounce";
import type { Product, ProductFilters } from "../types/product.types";
import { useProducts } from "../hooks/useProducts";

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
  retry: () => void;
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

  // Debounce search input
  const [debouncedSearch] = useDebounce(filters.search ?? "", 500);

  // Debounce price range
  const priceRange = useMemo(
    () => ({
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    }),
    [filters.minPrice, filters.maxPrice],
  );

  const [debouncePriceRange] = useDebounce(priceRange, 500);

  // Prepare filters for the API request
  const queryFilters = useMemo<ProductFilters>(
    () => ({
      ...filters,
      search: debouncedSearch.trim() || "",
      minPrice: debouncePriceRange.minPrice,
      maxPrice: debouncePriceRange.maxPrice,
    }),
    [filters, debouncedSearch, debouncePriceRange],
  );

  // Fetch products using the custom hook
  const {
    data,
    isError,
    isPending,
    refetch,
  } = useProducts(page, pageSize, queryFilters);

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalProducts = data?.totalProducts ?? 0;

  const error = isError
    ? "Unable to load products. Please try again."
    : null;

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
        retry: () => {
          void refetch();
        },
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
