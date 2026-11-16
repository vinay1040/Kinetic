import { useQuery } from "@tanstack/react-query";
import { getMonthlyRevenue } from "../../AdminServices/AdminService";

export const useMontlyRevenue = () => {
  return useQuery({
    queryKey: ["admin", "monthly-revenue"],
    queryFn: getMonthlyRevenue,
    staleTime: 60 * 1000,
  });
};
