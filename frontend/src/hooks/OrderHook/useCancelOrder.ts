import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { cancelOrder } from "@/services/Order";

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,

    onSuccess: async () => {
      message.success("Order cancelled successfully.");

      // Refresh the order list and any cached order details.
      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },

    onError: () => {
      message.error(
        "Unable to cancel this order. It may no longer be eligible for cancellation.",
      );
    },
  });
};
