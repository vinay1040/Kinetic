import { Link } from "react-router";
import { Trash2 } from "lucide-react";

import { useWishlist } from "@/context/WishlistContext";
import { AddToCart } from "@/components/products/AddToCart";

const Wishlist = () => {
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Wishlist
          </h1>
          <p className="mt-2 text-gray-500">
            Products you saved for later.
          </p>
        </div>

        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border p-8 text-center">
          <div className="mb-4 text-5xl">
            ♡
          </div>

          <h2 className="text-2xl font-semibold">
            Your wishlist is empty
          </h2>

          <p className="mt-2 text-gray-500">
            Save products you love and find them here later.
          </p>

          <Link
            to="/store"
            className="mt-6 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Wishlist
          </h1>

          <p className="mt-2 text-gray-500">
            {wishlist.length}{" "}
            {wishlist.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        <button
          onClick={clearWishlist}
          className="flex items-center gap-2 text-sm text-red-500"
        >
          <Trash2 size={17} />
          Clear Wishlist
        </button>
      </div>

      {/* Products */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border p-4"
          >
            <Link to={`/product/${product.id}`}>
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-56 w-full rounded-lg object-cover"
              />

              <h2 className="mt-4 font-medium">
                {product.title}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {product.category}
              </p>

              <p className="mt-2 font-semibold">
                ${product.price}
              </p>
            </Link>

            <div className="mt-4 flex items-center justify-between gap-3">
              <AddToCart
                product={product}
                variant="card"
              />

              <button
                onClick={() =>
                  removeFromWishlist(product.id)
                }
                className="rounded-lg border p-3"
                aria-label="Remove from wishlist"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Wishlist;
