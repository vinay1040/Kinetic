import { useAuth } from '@/context/AuthContext';
import { getCart } from '@/services/CartService'
import { useQuery } from '@tanstack/react-query'

export const useCart = () => {
    const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled:isAuthenticated,
  });
};
