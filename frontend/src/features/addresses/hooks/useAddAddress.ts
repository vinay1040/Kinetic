import {
  addAdress,
} from "@/features/addresses/services/AddressService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddressRequest } from "../types/address.types";

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
