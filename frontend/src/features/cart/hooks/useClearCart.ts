import { clearCart } from "@/features/cart/services/CartService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};
