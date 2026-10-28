import { useAuth } from '@/context/AuthContext';
import { getAddresses } from '@/services/AddressService'
import { useQuery } from '@tanstack/react-query'

export const useAddress = () => {
  const {isAuthenticated} = useAuth();
  return useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
    enabled: isAuthenticated,
  });
};

