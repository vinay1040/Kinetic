import { getMonthlyRevenue } from '@/services/admin/AdminDashBoard'
import { useQuery } from '@tanstack/react-query'

export const useMontlyRevenue = () => {
  return useQuery({
    queryKey : ["admin","monthly-revenue"],
    queryFn: getMonthlyRevenue,
    staleTime:60*1000,
  });
};