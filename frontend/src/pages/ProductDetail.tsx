import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "antd";
import { getProductById, type Product } from "@/services/productApi";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const data = await getProductById(Number(id));

        setProduct(data);
        setSelectedImage(data.thumbnail);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-[500px] animate-pulse rounded-2xl bg-slate-100" />

            <div className="space-y-5">
              <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
              <div className="h-12 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-20 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-10 w-32 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Something went wrong
          </h1>

          <p className="mt-2 text-sm text-slate-500">{error}</p>

          <Link
            to="/store"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white"
          >
            <ArrowLeft size={16} />
            Back to Store
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Product not found.</p>
      </main>
    );
  }

  const images = [product.thumbnail, ...(product.images ?? [])].filter(
    (image, index, array) => array.indexOf(image) === index,
  );
  const saved = isWishlisted(product.id);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/store" className="transition hover:text-primary">
            Store
          </Link>

          <span>/</span>

          <span className="capitalize">
            {product.category.replaceAll("-", " ")}
          </span>

          <span>/</span>

          <span className="truncate text-slate-900">{product.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex h-[450px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white sm:h-[550px]">
              <img
                src={selectedImage}
                alt={product.title}
                className="h-full w-full object-contain p-6 transition duration-300"
              />
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {images.slice(1, 5).map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white transition ${
                    selectedImage === image
                      ? "border-primary "
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="h-full w-full object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {product.category.replaceAll("-", " ")}
              </span>

              <div className="flex items-center gap-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />

                <span className="text-sm font-semibold text-slate-900">
                  {product.rating}
                </span>
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {product.title}
            </h1>

            {product.brand && (
              <p className="mt-2 text-sm text-slate-500">
                by{" "}
                <span className="font-medium text-slate-700">
                  {product.brand}
                </span>
              </p>
            )}

            <p className="mt-6 text-sm leading-7 text-slate-500">
              {product.description}
            </p>

            <div className="mt-7 border-y border-slate-100 py-6">
              <p className="text-3xl font-bold text-slate-900">
                ${product.price.toFixed(2)}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Inclusive of applicable taxes
              </p>
            </div>

            <div className="mt-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-sm font-medium text-green-600">
                    In Stock
                  </span>

                  <span className="text-xs text-slate-400">
                    ({product.stock} available)
                  </span>
                </div>
              ) : (
                <span className="text-sm font-medium text-red-500">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-slate-700">
                Quantity
              </p>

              <div className="flex w-fit items-center rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="flex h-10 w-10 items-center justify-center text-slate-500 transition hover:text-slate-900"
                >
                  <Minus size={16} />
                </button>

                <span className="flex h-10 w-10 items-center justify-center border-x border-slate-200 text-sm font-medium">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) => Math.min(product.stock, value + 1))
                  }
                  className="flex h-10 w-10 items-center justify-center text-slate-500 transition hover:text-slate-900"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="mt-7 flex gap-3">
              <Button
                type="primary"
                htmlType="button"
                disabled={product.stock === 0}
                onClick={() => addToCart(product, quantity)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </Button>

              <button
                type="button"
                aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={saved}
                onClick={() => toggleWishlist(product)}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-red-500"
              >
                <Heart
                  size={19}
                  className={saved ? "fill-red-500 text-red-500" : ""}
                />
              </button>
            </div>

            {/* Benefits */}
            <div className="mt-8 space-y-5 border-t border-slate-100 pt-7">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary">
                  <Truck size={17} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Free Next-Day Delivery
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Fast and secure delivery to your doorstep.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-800">
                    2-Year Warranty
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Comprehensive product protection included.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">
            Product Information
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Category</p>

              <p className="mt-1 text-sm font-medium capitalize text-slate-800">
                {product.category.replaceAll("-", " ")}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Brand</p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                {product.brand || "N/A"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Rating</p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                ⭐ {product.rating}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Availability</p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                {product.stock} units
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetail;
