import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../../AdminServices/AdminService";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["Order", "dashboard"],
    queryFn: getAdminDashboard,
    staleTime: 60 * 1000,
  });
};
