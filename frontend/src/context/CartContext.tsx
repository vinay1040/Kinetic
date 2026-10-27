import { message } from "antd";
import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { getProductById, type Product } from "@/services/productApi";
import { useAuth } from "./AuthContext";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/hooks/CartHook/useCart";
import { useAddCartItem } from "@/hooks/CartHook/useAddCartItem";
import { useRemoveCartItem } from "@/hooks/CartHook/useRemoveCartItem";
import { useUpdateCartItem } from "@/hooks/CartHook/useUpdateCartItem";
import { useClearCart } from "@/hooks/CartHook/useClearCart";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartContextType = {
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  retry: () => void;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productID: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  clearing: Boolean;
};

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const cartdata = useCart();
  const addToCartItem = useAddCartItem();
  const removeCartItem = useRemoveCartItem();
  const updateCart = useUpdateCartItem();
  const clearAllCart = useClearCart();
  const Items = cartdata.data?.items ?? [];

  const productQueries = useQueries({
    queries: Items.map((item) => ({
      queryKey: ["product", item.productId],
      queryFn: () => getProductById(item.productId),
      enabled: isAuthenticated && Boolean(item.productId),
      staleTime: 60_000,
    })),
  });

  const cart: CartItem[] = Items.flatMap((item, index) => {
    const product = productQueries[index]?.data;
    return product ? [{ product, quantity: item.quantity }] : [];
  });

  const addToCart = (product: Product, quantity: number) => {
    if (!isAuthenticated) {
      message.warning("Please log in to add items to your cart.");
      return;
    }
    addToCartItem.mutate(
      { productId: product.id, quantity: quantity },
      {
        onSuccess: () => {
          message.success(`${product.title} added to your cart.`);
        },
        onError: () => {
          message.error("Could not add this product to your cart.");
        },
      },
    );
  };

  const removeFromCart = (productId: string) => {
    removeCartItem.mutate(productId, {
      onError: () => {
        message.error("Could not remove this item.");
      },
    });
  };
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateCart.mutate(
      { productId: productId, quantity: quantity },
      {
        onError: () => {
          message.error(
            "Could not update the quantity. Check available stock.",
          );
        },
      },
    );
  };
  const clearCart = () => {
    if(clearAllCart.isPending) return;

    clearAllCart.mutate(undefined,{
      onSuccess: () => {
        message.success("Your cart has been cleared.");
      },
      onError: () => {
        message.error("Failed to clear your cart. Please try again.");
      },
    });
  };

  const loading =
    isAuthenticated &&
    (cartdata.isPending || productQueries.some((query) => query.isPending));

  const isProductError = productQueries.some((query) => query.isError);
  const error =
    cartdata.isError || isProductError
      ? "Unable to load your cart. Please try again."
      : null;
  const retry = () => {
    void queryClient.invalidateQueries({
      queryKey: ["cart"],
    });
    void queryClient.invalidateQueries({
      queryKey: ["product"],
    });
  };
  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        retry,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearing: clearAllCart.isPending,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};
