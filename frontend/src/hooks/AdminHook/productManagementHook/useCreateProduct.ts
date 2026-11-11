import { productKeys } from "@/lib/queryKeys";
import {
  createProduct,
} from "@/features/Product/services/productApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { ProductCreateRequest } from "@/features/Product/types/product.type";

const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: ProductCreateRequest) =>
      createProduct(productData),

    onSuccess: () => {
      message.success("Product created successfully");
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },

    onError: () => {
      message.error("Failed to create product");
    },
  });
};

export default useCreateProduct;
