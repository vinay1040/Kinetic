import {
  updateAddress,
} from "@/features/addresses/services/AddressService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddressRequest } from "../types/address.types";

interface UpdateAddressVariable {
  addressId: string;
  request: AddressRequest;
}
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addressId, request }: UpdateAddressVariable) =>
      updateAddress(addressId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });
};
