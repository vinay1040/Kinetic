import { getAllOrder } from "@/features/admin/AdminServices/AdminService";
import { adminKeys } from "@/features/admin/admin.keys";
import { useQuery } from "@tanstack/react-query";

export const useAllOrder = () => {
  return useQuery({
    queryKey: adminKeys.orders(),
    queryFn: getAllOrder,
    staleTime: 60 * 1000,
  });
};