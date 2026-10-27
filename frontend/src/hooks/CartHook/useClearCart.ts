import { clearCart } from '@/services/CartService';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'

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

