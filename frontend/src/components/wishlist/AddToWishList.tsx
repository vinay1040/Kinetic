import { Heart } from "lucide-react";

import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/services/productApi";

type AddToWishlistProps = {
  product: Product;
};

const AddToWishlist = ({ product }: AddToWishlistProps) => {
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  const handleWishlist = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <button
      onClick={handleWishlist}
      aria-label={
        isWishlisted
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      className="rounded-full bg-white p-2 shadow"
    >
      <Heart
        size={20}
        className={
          isWishlisted
            ? "fill-red-500 text-red-500"
            : "text-gray-700"
        }
      />
    </button>
  );
};

export default AddToWishlist;
