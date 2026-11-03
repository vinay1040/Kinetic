import { createOrder, type CreateOrderRequest } from "@/services/Order";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateOrderRequest) => createOrder(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
