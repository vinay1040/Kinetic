import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  Check,
} from "lucide-react";

import { useCartContext } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getProductById } from "@/features/Product/services/productApi";
import { formatCurrency } from "@/utils/formatCurrency";
import { productKeys } from "@/lib/queryKeys";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCartContext();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: productKeys.detail(id!),
    queryFn: () => {
      if (!id) throw new Error("Product ID is missing");
      return getProductById(id);
    },
    enabled: Boolean(id),
    staleTime: 60_000,
    gcTime: 300_000,
  });

  // Reset local state when navigating to another product.
  useEffect(() => {
    setSelectedImage("");
    setQuantity(1);
  }, [id]);

  if (isPending) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-3xl bg-slate-100" />
            <div className="space-y-5 py-4">
              <div className="h-5 w-28 animate-pulse rounded bg-slate-100" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
              <div className="h-14 w-48 animate-pulse rounded bg-slate-100" />
              <div className="h-12 w-full animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            {isError ? "Something went wrong" : "Product not found"}
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            {error instanceof Error
              ? error.message
              : "We couldn't find the product you're looking for."}
          </p>

          <Link
            to="/store"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <ArrowLeft size={17} />
            Back to Store
          </Link>
        </div>
      </main>
    );
  }

  const images = [product.thumbnail, ...product.images].filter(
    (image, index, array) => Boolean(image) && array.indexOf(image) === index,
  );

  const activeImage = selectedImage || images[0] || "";

  const saved = isWishlisted(product.id);
  const currentPrice = product.price;
  const orignnalPrice = product.originalPrice;
  const hasValidPrice = currentPrice !== null;

  const hasDiscount =
    currentPrice !== null &&
    orignnalPrice !== null &&
    orignnalPrice > currentPrice;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price!) / product.originalPrice!) *
          100,
      )
    : 0;

  const handleAddToCart = () => {
    if (!hasValidPrice) return;
    addToCart(product, quantity);
  };

  return (
    <main className="min-h-screen bg-slate-50/60 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Navigation */}
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 transition hover:text-primary"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <span>/</span>

          <Link to="/store" className="transition hover:text-primary">
            Store
          </Link>

          <span>/</span>

          <span className="truncate capitalize text-slate-800">
            {product.category.replaceAll("-", " ")}
          </span>
        </div>

        {/* Main Product Section */}
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Image Gallery */}
          <section className="min-w-0">
            <div className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
              {discountPercentage > 0 && (
                <span className="absolute left-5 top-5 z-10 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white">
                  {discountPercentage}% OFF
                </span>
              )}

              <button
                type="button"
                aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={saved}
                onClick={() => toggleWishlist(product)}
                className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:scale-105 hover:text-red-500"
              >
                <Heart
                  size={20}
                  className={saved ? "fill-red-500 text-red-500" : ""}
                />
              </button>

              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.title}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-sm text-slate-400">
                  No product image available
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => {
                  const isActive = activeImage === image;

                  return (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      aria-label={`View product image ${index + 1}`}
                      aria-pressed={isActive}
                      className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-white p-2 transition sm:h-24 sm:w-24 ${
                        isActive
                          ? "border-primary shadow-sm"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Product Information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            {/* Category and Rating */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                {product.category.replaceAll("-", " ")}
              </span>

              {product.rating !== null ? (
                <div className="flex items-center gap-1.5">
                  <Star size={17} className="fill-amber-400 text-amber-400" />

                  <span className="text-sm font-semibold text-slate-800">
                    {product.rating.toFixed(1)}
                  </span>

                  {product.numberOfRatings !== null && (
                    <span className="text-xs text-slate-400">
                      ({product.numberOfRatings.toLocaleString("en-IN")}{" "}
                      ratings)
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-slate-400">Not rated yet</span>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {product.title}
            </h1>

            {/* Category hierarchy */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>{product.mainCategory}</span>
              <span>•</span>
              <span>{product.subCategory}</span>
            </div>

            {/* Pricing */}
            <div className="mt-8 border-y border-slate-100 py-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {formatCurrency(currentPrice)}
                </span>

                {hasDiscount && (
                  <span className="text-base text-slate-400 line-through">
                    {formatCurrency(orignnalPrice)}
                  </span>
                )}
              </div>

              {hasDiscount && (
                <p className="mt-2 text-sm font-medium text-green-600">
                  You save{" "}
                  {hasDiscount && formatCurrency(orignnalPrice - currentPrice)}{" "}
                  ({discountPercentage}% off)
                </p>
              )}

              <p className="mt-3 text-xs text-slate-400">
                Final payable amount is calculated at checkout.
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mt-7">
              <p className="mb-3 text-sm font-semibold text-slate-800">
                Quantity
              </p>

              <div className="flex w-fit items-center overflow-hidden rounded-xl border border-slate-200">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="flex h-11 w-12 items-center justify-center text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={16} />
                </button>

                <span className="flex h-11 w-12 items-center justify-center border-x border-slate-200 text-sm font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= 100}
                  onClick={() =>
                    setQuantity((value) => Math.min(100, value + 1))
                  }
                  className="flex h-11 w-12 items-center justify-center text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Maximum 100 items. Availability is verified by the server.
              </p>
            </div>

            {/* Purchase Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={!hasValidPrice}
                onClick={handleAddToCart}
                className="flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={19} />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={saved}
                className={`flex h-13 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                  saved
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-slate-200 text-slate-700 hover:border-slate-400"
                }`}
              >
                <Heart size={19} className={saved ? "fill-red-500" : ""} />
                <span className="sm:hidden">
                  {saved ? "Saved" : "Wishlist"}
                </span>
              </button>
            </div>

            {!hasValidPrice && (
              <p className="mt-3 text-xs text-red-500">
                This product currently has no available price.
              </p>
            )}

            {/* Store Information */}
            <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Delivery information
                  </p>
                  <p className="text-xs text-slate-500">
                    Delivery options and charges are shown at checkout.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Secure shopping
                  </p>
                  <p className="text-xs text-slate-500">
                    Your order is processed through Kinetic's checkout.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-green-600">
                  <Check size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Inventory verification
                  </p>
                  <p className="text-xs text-slate-500">
                    Product availability is checked by the server.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Product Specifications */}
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Product Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Explore the available product details.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Category",
                value: product.category.replaceAll("-", " "),
              },
              {
                label: "Main Category",
                value: product.mainCategory || "N/A",
              },
              {
                label: "Sub Category",
                value: product.subCategory || "N/A",
              },
              {
                label: "Customer Rating",
                value:
                  product.rating !== null
                    ? `${product.rating.toFixed(1)} / 5`
                    : "Not rated",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-semibold capitalize text-slate-800">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetail;
