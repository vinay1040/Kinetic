import { getOrderById } from '@/services/Order'
import { useQuery } from '@tanstack/react-query'


export const useOrderById = (id:string) => {
  return useQuery({
    queryKey: ["orders",id],
    queryFn: () => getOrderById(id),
    enabled: Boolean(id),
  });
}