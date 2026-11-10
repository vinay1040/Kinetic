import { productKeys } from "@/lib/queryKeys";
import {
  createProduct,
  type ProductCreateRequest,
} from "@/services/productApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

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
