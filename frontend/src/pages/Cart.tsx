import { Link } from "react-router";
import { Trash2 } from "lucide-react";

import CartItem from "@/components/cart/CartItems";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { cart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="mt-2 text-gray-500">Review your selected products.</p>
        </div>

        <EmptyCart />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Cart</h1>

          <p className="mt-2 text-gray-500">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="flex items-center gap-2 text-sm text-red-500"
        >
          <Trash2 size={17} />
          Clear Cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl px-5 bg-blue-50">
          {cart.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        <CartSummary />
      </div>

      <div className="mt-6">
        <Link to="/store" className="text-sm font-medium underline">
          ← Continue Shopping
        </Link>
      </div>
    </main>
  );
};

export default Cart;
