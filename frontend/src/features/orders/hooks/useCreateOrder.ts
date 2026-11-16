import {
  createOrder,
} from "@/features/orders/services/Order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateOrderRequest } from "../types/Order.types";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateOrderRequest) => createOrder(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
