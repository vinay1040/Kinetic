import { getAllOrder } from "@/features/admin/AdminServices/AdminService";
import { useQuery } from "@tanstack/react-query";

export const useAllOrder = () => {
  return useQuery({
    queryKey: ["orders", "admin"],
    queryFn: getAllOrder,
    staleTime: 60 * 1000,
  });
};