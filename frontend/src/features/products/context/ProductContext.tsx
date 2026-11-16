import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { ProductFilters } from "../types/product.types";

type ProductContextType = {
  filters: ProductFilters;
  setFilters: React.Dispatch<
    React.SetStateAction<ProductFilters>
  >;
};

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [filters, setFilters] = useState<ProductFilters>({});

  return (
    <ProductContext.Provider value={{ filters, setFilters }}>
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
