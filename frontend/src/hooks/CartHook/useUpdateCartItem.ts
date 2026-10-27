import {
  updateCartItem,
  type UpdateCartQuantityRequest,
} from "@/services/CartService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateCartVariables = {
  productId: string;
  quantity: number;
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: UpdateCartVariables) =>
      updateCartItem(productId, { quantity } satisfies UpdateCartQuantityRequest),
    onSuccess: async () => {
        await queryClient.invalidateQueries({
            queryKey: ["cart"]
        });
    },
  });
};
