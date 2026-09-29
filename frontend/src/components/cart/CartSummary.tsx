import { useCart } from "@/context/CartContext";
import { Link } from "react-router";

const CartSummary = () => {
  const { cart } = useCart();

  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const shipping = subtotal >= 500 ? 0 : 15;

  const tax = subtotal * 0.05;

  const total = subtotal + shipping + tax;

  return (
    <div className="rounded-xl border p-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Link
          to="/checkout"
          className="block w-full rounded-lg bg-black px-6 py-3 text-center text-sm font-medium text-white"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
