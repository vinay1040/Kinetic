import { Link } from "react-router";
import { AddToCart } from "@/features/Product/components/AddToCart";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { Heart, Star, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import type { Product } from "../types/product.types";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { isWishlisted, toggleWishlist } = useWishlist();

  const saved = isWishlisted(product.id);

  const hasDiscount =
    product.price !== null &&
    product.originalPrice !== null &&
    product.originalPrice > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price!) / product.originalPrice!) *
          100,
      )
    : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-slate-50">
        <Link
          to={`/product/${product.id}`}
          aria-label={`View ${product.title}`}
          className="block"
        >
          <div className="flex aspect-[4/3] items-center justify-center p-5 sm:aspect-square">
            <img
              src={product.thumbnail}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={saved}
          onClick={() => toggleWishlist(product)}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:scale-105 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          <Heart
            size={19}
            className={
              saved ? "fill-red-500 text-red-500" : "transition-colors"
            }
          />
        </button>

        {/* Quick View Indicator */}
        <Link
          to={`/product/${product.id}`}
          aria-label={`View details for ${product.title}`}
          className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white text-slate-700 opacity-0 shadow-md transition-all duration-300 hover:bg-slate-900 hover:text-white group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight size={18} />
        </Link>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        <p className="mb-2 line-clamp-1 text-xs font-medium uppercase tracking-wider text-slate-400">
          {product.category.replaceAll("-", " ")}
        </p>

        {/* Product Title */}
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-slate-800 transition-colors hover:text-primary sm:text-base"
        >
          {product.title}
        </Link>

        {/* Rating */}
        <div className="mt-3 flex min-h-5 items-center gap-1.5">
          {product.rating !== null ? (
            <>
              <Star size={15} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-slate-700">
                {product.rating.toFixed(1)}
              </span>

              {product.numberOfRatings !== null && (
                <span className="text-xs text-slate-400">
                  ({product.numberOfRatings.toLocaleString("en-IN")})
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-slate-400">No ratings yet</span>
          )}
        </div>

        {/* Price and Add to Cart */}
        <div className="mt-auto flex flex-col gap-3 pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(product.price)}
            </span>

            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <AddToCart product={product} variant="card" />
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
