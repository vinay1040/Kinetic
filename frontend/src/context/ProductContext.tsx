import { getData, type Product } from "@/services/productApi";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
export type ProductSortBy = "price" | "rating" | "stock" | "title";
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
export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;

  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  // const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
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
  // const [totalPages, setTotalPages] = useState(0);
  // const [totalProducts, settotalProducts] = useState(0);
  const { data, isPending, isError } = useQuery({
    queryKey: ["products", page, pageSize, queryFilters],
    queryFn: () => getData(page, pageSize, queryFilters),
    staleTime: 60_000,
  });

  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);

  //       const data = await getData(page, pageSize);
  //       setProducts(data.products);
  //       setPage(data.page);
  //       setPageSize(data.pageSize);
  //       setTotalPages(data.totalPages);
  //       settotalProducts(data.totalProducts);
  //     } catch (err) {
  //       console.error("Failed to load products:", err);
  //       setError("Unable to load products. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadData();
  // }, [page]);
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
      {" "}
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
