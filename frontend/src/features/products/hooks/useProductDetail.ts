import { useQuery } from "@tanstack/react-query";
import { productKeys } from "../product.keys";
import { getProductById } from "../services/productApi";

export const useProductDetail = (id?: string) => {
  return useQuery({
    queryKey: productKeys.detail(id ? id : ""),
    queryFn: () => {
      if (!id) {
        throw new Error("Product ID is missing");
      }

      return getProductById(id);
    },
    enabled: Boolean(id),
    staleTime: 60 * 1000,
    gcTime:5*60*1000,
  });
};
