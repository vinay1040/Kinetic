import { adminKeys } from '@/features/admin/admin.keys'
import { getAdminOrderDetail } from '@/features/admin/AdminServices/AdminService'
import { useQuery } from '@tanstack/react-query'

export const useAdminOrderDetail = (id:string) => {
  return useQuery({
    queryKey: adminKeys.orderDetail(id),
    queryFn: () => getAdminOrderDetail(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
};