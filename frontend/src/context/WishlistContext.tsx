/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/services/productApi";

type WishlistContextValue = {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
  isWishlisted: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
};

export const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "kinetic-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY);
      return savedItems ? JSON.parse(savedItems) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const value = useMemo(
    () => ({
      wishlist,
      addToWishlist: (product: Product) => {
        setWishlist((currentItems) =>
          currentItems.some((item) => item.id === product.id)
            ? currentItems
            : [...currentItems, product],
        );
      },
      removeFromWishlist: (productId: number) => {
        setWishlist((currentItems) =>
          currentItems.filter((item) => item.id !== productId),
        );
      },
      clearWishlist: () => setWishlist([]),
      isInWishlist: (productId: number) =>
        wishlist.some((item) => item.id === productId),
      isWishlisted: (productId: number) =>
        wishlist.some((item) => item.id === productId),
      toggleWishlist: (product: Product) => {
        setWishlist((currentItems) =>
          currentItems.some((item) => item.id === product.id)
            ? currentItems.filter((item) => item.id !== product.id)
            : [...currentItems, product],
        );
      },
    }),
    [wishlist],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}
export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}
