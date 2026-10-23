import { getOrderData } from "@/services/Order";
import { useQuery } from "@tanstack/react-query";


export const useMyOrder = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrderData,
  });
};
