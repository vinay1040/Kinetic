import { ArrowLeft, Package } from "lucide-react";
import { Link, useParams } from "react-router";
import { useOrderById } from "@/hooks/OrderHook/useOrderById";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatOrderDate, getOrderStatus } from "@/utils/orderUtils";
import { useCancelOrder } from "@/hooks/OrderHook/useCancelOrder";

const OrderDetail = () => {
  const { orderId = "" } = useParams();
  const {
    data: order,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useOrderById(orderId);
  const cancelOrderMutation = useCancelOrder();

  const canCancelOrder = order?.status === 0 || order?.status === 1;

  const handleCancelOrder = () => {
    if (!order || !canCancelOrder) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (confirmed) {
      cancelOrderMutation.mutate(order.id);
    }
  };
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4 rounded-xl border bg-white p-8 text-center">
        <h1 className="text-xl font-semibold">Unable to load order</h1>

        <p className="text-sm text-gray-500">
          Something went wrong while fetching this order.
        </p>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isFetching ? "Retrying..." : "Try Again"}
        </button>

        <div>
          <Link
            to="/profile/orders"
            className="inline-flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4 rounded-xl border bg-white p-8 text-center">
        <h1 className="text-xl font-semibold">Order Not Found</h1>

        <p className="text-sm text-gray-500">
          We couldn't find an order with this ID.
        </p>

        <Link
          to="/profile/orders"
          className="inline-flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
      </div>
    );
  }

  const status = getOrderStatus(order.status);
  const items = Array.isArray(order.items) ? order.items : [];
  const shippingAddress = order.shippingAddress;

  return (
    <div className="space-y-6">
      <Link
        to="/profile/orders"
        className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-black"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      <div>
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>

        <p className="mt-1 text-gray-500">
          Placed on {formatOrderDate(order.createdAt)}
        </p>
      </div>

      {/* Order Status */}

      {/* Order Status */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Order Status</p>
            <p className="mt-1 font-semibold">{status.label}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${status.style}`}
            >
              {status.label}
            </span>

            {canCancelOrder && (
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancelOrderMutation.isPending}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelOrderMutation.isPending
                  ? "Cancelling..."
                  : "Cancel Order"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b p-5">
          <h2 className="font-semibold">Products</h2>
        </div>

        <div className="divide-y">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 p-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.productTitle}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <Package className="text-gray-400" size={28} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-medium">{item.productTitle}</h3>

                <p className="mt-2 text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Unit price: {formatCurrency(item.unitPrice)}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {formatCurrency(item.lineTotal)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Price Summary */}
        <div className="space-y-3 border-t p-5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span>{formatCurrency(order.shippingCost)}</span>
          </div>

          <div className="flex justify-between border-t pt-3">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Shipping Address</h2>

        {shippingAddress ? (
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <p className="font-medium text-gray-900">
              {shippingAddress.fullName}
            </p>

            <p>{shippingAddress.phone}</p>
            <p>{shippingAddress.addressLine1}</p>

            {shippingAddress.addressLine2 && (
              <p>{shippingAddress.addressLine2}</p>
            )}

            <p>
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.postalCode}
            </p>

            <p>{shippingAddress.country}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            Shipping address unavailable.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
