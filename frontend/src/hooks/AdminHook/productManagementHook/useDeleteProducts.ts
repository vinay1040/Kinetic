import { productKeys } from "@/lib/queryKeys";
import { deleteProduct } from "@/features/Product/services/productApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

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
