import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { productKeys } from "../../../products/product.keys";
import { deleteProduct } from "../../../products/services/productApi";

const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),

    onSuccess: () => {
      message.success("Product deleted successfully");

      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },

    onError: () => {
      message.error("Failed to delete product");
    },
  });
};

export default useDeleteProduct;
