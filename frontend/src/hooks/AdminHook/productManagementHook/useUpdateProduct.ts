import { updateProduct } from "@/features/Product/services/productApi";
import type { Product, ProductUpdateRequest } from "@/features/Product/types/product.type";
import { productKeys } from "@/lib/queryKeys";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

interface UpdateProductVariables {
  id: string;
  data: ProductUpdateRequest;
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateProductVariables) =>
      updateProduct(id, data),

    onMutate: async ({ id, data }) => {
      const queryKey = productKeys.detail(id);

      await queryClient.cancelQueries({ queryKey });

      const previousProduct = queryClient.getQueryData<Product>(queryKey);

      if (previousProduct) {
        queryClient.setQueryData<Product>(queryKey, {
          ...previousProduct,
          ...data,
        });
      }

      return { previousProduct, queryKey };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousProduct) {
        queryClient.setQueryData(context.queryKey, context.previousProduct);
      }

      message.error("Failed to update product");
    },

    onSuccess: () => {
      message.success("Product updated successfully");
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
  });
};
