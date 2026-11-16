import { useQuery } from "@tanstack/react-query";
import { getCategoriesRevenue } from "../../AdminServices/AdminService";

export const useCategoriesRevenue = () => {
  return useQuery({
    queryKey: ["admin", "category-revenue"],
    queryFn: getCategoriesRevenue,
    staleTime: 60 * 1000,
  });
};
