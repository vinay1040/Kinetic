import { getData, type Product } from "@/services/productApi";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ProductContextType = {
  products: Product[];
  // fetchProducts: () => Promise<void>;
  // getProductById: (id: number) => Product | null;
};

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProduct] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const Data = await getData();

      if (Data) {
        setProduct(Data);
      }
    };
    loadData();
  }, []);

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);

  if (context == undefined) {
    throw new Error("useProduct must be used inside AuthProvider");
  }
  return context;
};
