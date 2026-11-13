import { useQuery } from "@tanstack/react-query"
import { productKeys } from "../product.keys"
import { getCategory } from "../services/productApi"

export const useCategory = () => {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: getCategory,
    staleTime:5*60*1000,
  });
};