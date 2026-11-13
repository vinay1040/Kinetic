import { getAdminDashboard } from "@/features/admin/dashboard/service/AdminDashBoard";
import { useQuery } from "@tanstack/react-query";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["Order", "dashboard"],
    queryFn: getAdminDashboard,
    staleTime: 60 * 1000,
  });
};
