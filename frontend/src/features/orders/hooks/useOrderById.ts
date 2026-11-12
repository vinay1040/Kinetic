import { getOrderById } from "@/features/orders/services/Order";
import { useQuery } from "@tanstack/react-query";

export const useOrderById = (id: string) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
};
