import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { message } from "antd";

import { useAddress } from "@/hooks/AddressHook/useAddress";
import { useCreateOrder } from "@/hooks/OrderHook/useCreateOrder";
import { useCartContext } from "@/context/CartContext";

const Checkout = () => {
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const navigate = useNavigate();
  const { cart, loading: cartLoading, error: cartError } = useCartContext();
  const {
    data: addresses = [],
    isPending: addressesLoading,
    isError: addressesError,
  } = useAddress();

  const createOrder = useCreateOrder();

  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      message.warning("Please select a shipping address.");
      return;
    }

    if (cart.length === 0) {
      message.warning("Your cart is empty.");
      return;
    }

    try {
      const response = await createOrder.mutateAsync({
        shippingAddressId: selectedAddressId,
      });

      message.success(response.message || "Order placed successfully.");

      // The backend clears the cart when order creation succeeds.
      await navigate(`/profile/orders/${response.order.id}`);
    } catch {
      message.error(
        "Could not place your order. Please check your address and product stock.",
      );
    }
  };

  if (cartLoading || addressesLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-slate-500">Loading checkout...</p>
      </main>
    );
  }

  if (cartError || addressesError) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-3 text-red-600">
          Unable to load your checkout details. Please try again.
        </p>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">
          Add products to your cart before checking out.
        </p>
        <Link to="/store" className="mt-4 inline-block underline">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="mt-2 text-slate-500">
        Select a saved address and review your order.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_340px]">
        <section className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Shipping address</h2>

          {addresses.length === 0 ? (
            <div className="mt-4">
              <p className="text-slate-600">You have no saved addresses yet.</p>
              <Link
                to="/profile/settings"
                className="mt-3 inline-block font-medium underline"
              >
                Add an address in Settings
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${
                    selectedAddressId === address.id
                      ? "border-black bg-slate-50"
                      : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingAddress"
                    value={address.id}
                    checked={selectedAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                    className="mt-1"
                  />

                  <span className="min-w-0">
                    <span className="block font-semibold">
                      {address.label}
                      {address.isDefault ? " (Default)" : ""}
                    </span>
                    <span className="mt-1 block">{address.fullName}</span>
                    <span className="block text-sm text-slate-600">
                      {address.addressLine1}
                      {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                    </span>
                    <span className="block text-sm text-slate-600">
                      {address.city}, {address.state} {address.postalCode}
                    </span>
                    <span className="block text-sm text-slate-600">
                      {address.country} · {address.phone}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>

        <aside className="h-fit rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Order summary</h2>

          <div className="mt-5 space-y-4">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between gap-4">
                <span className="text-sm text-slate-600">
                  {product.title} × {quantity}
                </span>
                <span className="shrink-0 font-medium">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="flex justify-between border-t pt-4">
              <span>Estimated subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            <p className="text-xs text-slate-500">
              The backend calculates the final order total using current product
              prices. Shipping and tax are not added by this checkout until
              matching backend rules are implemented.
            </p>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={
                addresses.length === 0 ||
                !selectedAddressId ||
                createOrder.isPending
              }
              className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createOrder.isPending ? "Placing order..." : "Place order"}
            </button>

            <Link to="/cart" className="block text-center text-sm underline">
              Return to cart
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
