import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { ProductCreateRequest } from "../../../products/types/product.types";
import { productKeys } from "../../../products/product.keys";
import { createProduct } from "../../../products/services/productApi";

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
