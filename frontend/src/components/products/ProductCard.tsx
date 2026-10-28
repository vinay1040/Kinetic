import { Link } from "react-router";
import type { Product } from "@/services/productApi";
import { AddToCart } from "@/components/products/AddToCart";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";

type ProductCardProps = {
  product: Product;
};
const ProductCard = ({ product }: ProductCardProps) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const saved = isWishlisted(product.id);

  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-gray-100 sm:aspect-auto sm:h-60">
          <button
            type="button"
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={saved}
            onClick={(event) => {
              event.preventDefault();
              toggleWishlist(product);
            }}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm transition hover:scale-105 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            <Heart
              size={18}
              className={saved ? "fill-red-500 text-red-500" : ""}
            />
          </button>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <h2 className="line-clamp-1 min-h-6 text-base font-semibold sm:min-h-7 sm:text-lg">
            {product.title}
          </h2>

          <div className="mt-3 flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm font-medium">{product.rating}</span>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
            <span className="text-lg font-bold">${product.price}</span>

            <AddToCart product={product} variant="card" />
          </div>
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;
