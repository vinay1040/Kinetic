import { addCartItem, type CartItemRequest } from '@/services/CartService';
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAddCartItem = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CartItemRequest) => addCartItem(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:["cart"],
      });
    },
  });
};

 