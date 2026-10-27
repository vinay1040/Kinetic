import { removeCartItem } from "@/services/CartService";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId:string) => removeCartItem(productId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey:["cart"]
            });
        },
    });
};