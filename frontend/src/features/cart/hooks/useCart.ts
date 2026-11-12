import { useAuth } from "@/features/auth/context/AuthContext";
import { getCart } from "@/features/cart/services/CartService";
import { useQuery } from "@tanstack/react-query";

export const useCart = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated,
  });
};
