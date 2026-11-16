import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

import { adminKeys } from "@/features/admin/admin.keys";
import { confirmOrder } from "../../AdminServices/AdminService";
import axios from "axios";

export const useConfirmOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmOrder,

    onSuccess: async (data) => {
      message.success(data.message);

      await queryClient.invalidateQueries({
        queryKey: adminKeys.orders(),
      });
    },

    onError: (error: unknown) => {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        const serverMessage = error.response?.data?.message;

        message.error(
          serverMessage || "Unable to confirm order. Please try again.",
        );

        return;
      }

      message.error("An unexpected error occurred.");
    },
  });
};
