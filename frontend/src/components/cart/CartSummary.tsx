
import { Link } from "react-router";
import { ArrowRight, ShoppingBag, Truck } from "lucide-react";

import { useCartContext } from "@/context/CartContext";
import { formatCurrency } from "@/utils/formatCurrency";

const CartSummary = () => {
  const { cart } = useCartContext();

  const hasUnavailablePrice = cart.some(
    (item) => item.product.price === null,
  );

  const subtotal = cart.reduce(
    (total, item) =>
      total + (item.product.price ?? 0) * item.quantity,
    0,
  );

  // Current backend order calculation:
  // ShippingCost = 0
  // Total = subtotal
  const shipping = 0;
  const total = subtotal + shipping;

  const canCheckout =
    cart.length > 0 && !hasUnavailablePrice;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold text-slate-900">
        Order Summary
      </h2>

      <div className="mt-6 space-y-5">

        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Subtotal ({cart.length} items)
          </span>

          <span className="font-semibold text-slate-900">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-500">
            <Truck size={16} />
            Shipping
          </span>

          <span className="font-medium text-green-600">
            {shipping === 0 ? "Free" : formatCurrency(shipping)}
          </span>
        </div>

        {/* Unavailable Price Warning */}
        {hasUnavailablePrice && (
          <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            Some products have unavailable prices. Please remove them
            or try again before checkout.
          </div>
        )}

        {/* Total */}
        <div className="border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-slate-900">
              Order Total
            </span>

            <span className="text-xl font-bold text-slate-900">
              {formatCurrency(total)}
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Final order amount is verified by the server during checkout.
          </p>
        </div>

        {/* Checkout */}
        {canCheckout ? (
          <Link
            to="/checkout"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <ShoppingBag size={18} />
            Proceed to Checkout
            <ArrowRight size={17} />
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-500"
          >
            <ShoppingBag size={18} />
            {cart.length === 0 ? "Your Cart Is Empty" : "Checkout Unavailable"}
          </button>
        )}
      </div>
    </aside>
  );
};

export default CartSummary;
