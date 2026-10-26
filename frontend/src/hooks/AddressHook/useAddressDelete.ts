import { deleteAddress } from "@/services/AddressService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddressDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId:string) => deleteAddress(addressId),
    onSuccess: async () => {
        await queryClient.invalidateQueries({
            queryKey:["addresses"],
        });
    },
  });
};
