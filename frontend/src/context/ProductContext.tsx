import { getData, type Product } from "@/services/productApi";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

type ProductContextType = {
  products: Product[];
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
  // const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 40;
  // const [totalPages, setTotalPages] = useState(0);
  // const [totalProducts, settotalProducts] = useState(0);
  const { data, isPending, isError } = useQuery({
    queryKey: ["products", page, pageSize],
    queryFn: () => getData(page, pageSize),
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
        pageSize,
        totalPages,
        totalProducts,
        setPage,
        loading : isPending,
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
