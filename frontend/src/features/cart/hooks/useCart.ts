import { useAuth } from "@/features/auth/context/AuthContext";
import { getCart } from "@/Services/CartService";
import { useQuery } from "@tanstack/react-query";

export const useCart = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated,
  });
};
