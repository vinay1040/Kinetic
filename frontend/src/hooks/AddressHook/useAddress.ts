import { getAddresses } from '@/services/AddressService'
import { useQuery } from '@tanstack/react-query'

export const useAddress = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });
};

