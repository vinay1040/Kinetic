import { useCart } from "@/context/CartContext";
import type { Product } from "@/services/productApi";
import { Button } from "antd";
import { ShoppingBag } from "lucide-react";

type AddToCart = {
  product: Product;
  variant: "card" | "detail";
};

export const AddToCart = ({ product, variant }: AddToCart) => {
  const { addToCart } = useCart();
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1);
  };
  if (variant === "card") {
    return (
      <Button
        type="primary"
        onClick={handleAddToCart}
        className="cursor-pointer rounded-lg bg-black px-4 py-2 text-sm text-white"
      >
        <ShoppingBag size={18} />
      </Button>
    );
  }
  return (
    <Button
      type="primary"
      onClick={handleAddToCart}
      className="cursor-pointer rounded-lg bg-black px-4 py-2 text-sm text-white"
    >
      <ShoppingBag size={18} />
      Add To Cart
    </Button>
  );
};
