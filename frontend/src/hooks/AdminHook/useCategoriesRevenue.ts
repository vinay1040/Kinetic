import { getCategoriesRevenue } from "@/services/admin/AdminDashBoard"
import { useQuery } from "@tanstack/react-query"

export const useCategoriesRevenue = () => {
  return useQuery({
    queryKey: ["admin" , "category-revenue"],
    queryFn: getCategoriesRevenue,
    staleTime: 60*1000,
  });
};