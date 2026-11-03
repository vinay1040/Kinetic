import { addAdress, type AddressRequest } from "@/services/AddressService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AddressRequest) => addAdress(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });
};