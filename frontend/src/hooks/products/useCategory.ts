import { useQuery } from "@tanstack/react-query";
import { productKeys } from "../../features/products/product.keys";
import { getCategory } from "../../Services/productApi";

export const useCategory = () => {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: getCategory,
    staleTime: 5 * 60 * 1000,
  });
};
