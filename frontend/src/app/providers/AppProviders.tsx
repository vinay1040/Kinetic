import { AuthProvider } from "@/features/auth/context/AuthContext";
import { CartProvider } from "@/features/cart/context/CartContext";
import { ProductProvider } from "@/features/products/context/ProductContext"
import { WishlistProvider } from "@/features/wishlist/context/WishlistContext";
import type { ReactNode } from "react"
type AppProvidersProps = {
  children: ReactNode;
};
export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ProductProvider >
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    {children}
                </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    </ProductProvider>
  )
}

