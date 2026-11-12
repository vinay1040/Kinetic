import { ShoppingBag } from "lucide-react";
import { Link } from "react-router";

const EmptyCart = () => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border p-8 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <ShoppingBag size={32} />
      </div>

      <h2 className="text-2xl font-semibold">
        Your cart is empty
      </h2>

      <p className="mt-2 max-w-md text-sm text-gray-500">
        Looks like you haven't added anything to your cart yet.
      </p>

      <Link
        to="/store"
        className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;