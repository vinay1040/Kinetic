
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { message } from "antd";
import {
  ArrowLeft,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { useAddress } from "@/hooks/AddressHook/useAddress";
import { useCreateOrder } from "@/hooks/OrderHook/useCreateOrder";
import { useCartContext } from "@/context/CartContext";
import { formatCurrency } from "@/utils/formatCurrency";

const Checkout = () => {
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const navigate = useNavigate();

  const {
    cart,
    loading: cartLoading,
    error: cartError,
  } = useCartContext();

  const {
    data: addresses = [],
    isPending: addressesLoading,
    isError: addressesError,
  } = useAddress();

  const createOrder = useCreateOrder();

  // Automatically select the default address.
  useEffect(() => {
    if (selectedAddressId || addresses.length === 0) return;

    const defaultAddress = addresses.find(
      (address) => address.isDefault,
    );

    setSelectedAddressId(
      defaultAddress?.id ?? addresses[0].id,
    );
  }, [addresses, selectedAddressId]);

  // Check whether any cart product has an unavailable price.
  const hasUnavailablePrice = cart.some(
    (item) => item.product.price === null,
  );

  // Calculate the estimated subtotal.
  const subtotal = cart.reduce(
    (total, item) =>
      total + (item.product.price ?? 0) * item.quantity,
    0,
  );

  // Current backend rules:
  // ShippingCost = 0
  // Total = subtotal
  const shipping = 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      message.warning("Please select a shipping address.");
      return;
    }

    if (cart.length === 0) {
      message.warning("Your cart is empty.");
      return;
    }

    if (hasUnavailablePrice) {
      message.error(
        "Some products have unavailable prices. Please update your cart.",
      );
      return;
    }

    try {
      const response = await createOrder.mutateAsync({
        shippingAddressId: selectedAddressId,
      });

      message.success(
        response.message || "Order placed successfully.",
      );

      navigate(`/profile/orders/${response.order.id}`);
    } catch {
      message.error(
        "Could not place your order. Please check your address, product prices and stock.",
      );
    }
  };

  // Loading
  if (cartLoading || addressesLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-slate-100" />
          <div className="grid gap-8 md:grid-cols-[1fr_360px]">
            <div className="h-96 rounded-2xl bg-slate-100" />
            <div className="h-80 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </main>
    );
  }

  // Error
  if (cartError || addressesError) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Unable to load checkout
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            We couldn't load your cart or address information.
            Please try again.
          </p>

          <Link
            to="/cart"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </Link>
        </div>
      </main>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <ShoppingBag size={32} className="text-slate-400" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            to="/store"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/60 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Confirm your delivery address and review your order.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">

          {/* Left Column */}
          <div className="space-y-6">

            {/* Shipping Address */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <MapPin size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Shipping Address
                  </h2>
                  <p className="text-xs text-slate-500">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              {addresses.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-6 text-center">
                  <MapPin
                    size={28}
                    className="mx-auto text-slate-400"
                  />

                  <p className="mt-3 font-semibold text-slate-800">
                    No saved addresses
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Add a delivery address before placing your order.
                  </p>

                  <Link
                    to="/profile/settings"
                    className="mt-4 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Add Address
                  </Link>
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {addresses.map((address) => {
                    const selected =
                      selectedAddressId === address.id;

                    return (
                      <label
                        key={address.id}
                        className={`relative flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                          selected
                            ? "border-primary bg-blue-50/40 ring-1 ring-primary"
                            : "border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingAddress"
                          value={address.id}
                          checked={selected}
                          onChange={() =>
                            setSelectedAddressId(address.id)
                          }
                          className="mt-1 accent-current"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              {address.label}
                            </span>

                            {address.isDefault && (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                DEFAULT
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm font-medium text-slate-800">
                            {address.fullName}
                          </p>

                          <p className="mt-1 text-sm leading-5 text-slate-500">
                            {address.addressLine1}
                            {address.addressLine2
                              ? `, ${address.addressLine2}`
                              : ""}
                          </p>

                          <p className="text-sm text-slate-500">
                            {address.city}, {address.state}{" "}
                            {address.postalCode}
                          </p>

                          <p className="mt-2 text-xs text-slate-500">
                            {address.country} · {address.phone}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Order Items */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Package size={19} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Order Items
                    </h2>
                    <p className="text-xs text-slate-500">
                      {cart.length} products in your cart
                    </p>
                  </div>
                </div>

                <Link
                  to="/cart"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Edit Cart
                </Link>
              </div>

              <div className="mt-6 divide-y divide-slate-100">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                        {product.title}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        Quantity: {quantity}
                      </p>

                      <p className="mt-2 text-sm font-bold text-slate-900">
                        {formatCurrency(
                          product.price === null
                            ? null
                            : product.price * quantity,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Summary */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-xl font-bold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Subtotal
                </span>

                <span className="font-semibold text-slate-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-500">
                  <Truck size={16} />
                  Shipping
                </span>

                <span className="font-semibold text-green-600">
                  {shipping === 0
                    ? "Free"
                    : formatCurrency(shipping)}
                </span>
              </div>

              {hasUnavailablePrice && (
                <div className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                  Some products have unavailable prices. Update your cart before placing the order.
                </div>
              )}

              <div className="border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    Estimated Total
                  </span>

                  <span className="text-xl font-bold text-slate-900">
                    {formatCurrency(total)}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  The final amount is calculated and verified by the server using current product prices.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={
                  addresses.length === 0 ||
                  !selectedAddressId ||
                  hasUnavailablePrice ||
                  createOrder.isPending
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={18} />

                {createOrder.isPending
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              <Link
                to="/cart"
                className="block text-center text-sm font-medium text-slate-500 transition hover:text-slate-900"
              >
                Return to Cart
              </Link>
            </div>

            {/* Security Information */}
            <div className="mt-6 flex items-start gap-3 border-t border-slate-100 pt-5">
              <ShieldCheck
                size={19}
                className="shrink-0 text-green-600"
              />

              <p className="text-xs leading-5 text-slate-500">
                Your order is validated by Kinetic's backend before it is created.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
