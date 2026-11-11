import { updateProduct } from "@/features/Product/services/productApi";
import type { Product, ProductUpdateRequest, ProductUpdateResponse } from "@/features/Product/types/product.type";
import { productKeys } from "@/lib/queryKeys";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

type UpdateProductVariables = {
  id: string;
  updateData: ProductUpdateRequest;
};

type RollbackContext = {
  previousProduct: Product | undefined;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ProductUpdateResponse,
    Error,
    UpdateProductVariables,
    RollbackContext
  >({
    mutationFn: ({ id, updateData }) => updateProduct(id, updateData),

    onMutate: async ({ id, updateData }) => {
      const queryKey = productKeys.detail(id);

      await queryClient.cancelQueries({ queryKey });

      const previousProduct = queryClient.getQueryData<Product>(queryKey);

      queryClient.setQueryData<Product>(queryKey, (oldProduct) =>
        oldProduct ? { ...oldProduct, ...updateData } : oldProduct,
      );

      return { previousProduct };
    },

    onError: (_error, variables, context) => {
      const queryKey = productKeys.detail(variables.id);
      if (context?.previousProduct !== undefined) {
        queryClient.setQueryData(queryKey, context.previousProduct);
      }

      message.error("Failed to update product");
    },

    onSuccess: () => {
      message.success("Product updated successfully");
    },

    onSettled: async (_data, _error, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: productKeys.detail(variables.id),
        }),

        queryClient.invalidateQueries({
          queryKey: productKeys.all,
        }),
      ]);
    },
  });
};
