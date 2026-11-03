
import { getAllOrder } from '@/services/admin/AdminDashBoard';
import { useQuery } from '@tanstack/react-query'

export const useAllOrder = () => {
  return useQuery({
    queryKey: ["orders","admin"],
    queryFn: getAllOrder,
    staleTime: 60*1000,
  });
};