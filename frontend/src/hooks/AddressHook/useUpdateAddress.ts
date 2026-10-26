import { updateAddress, type AddressRequest } from '@/services/AddressService';
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UpdateAddressVariable{
    addressId: string,
    request: AddressRequest;
}
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({addressId, request} : UpdateAddressVariable) => updateAddress(addressId,request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["addresses"]
            });
        },
    });
};

