import OrderCard from "@/components/account/OrderCard";
import { useMyOrder } from "@/hooks/CustomerHook/OrderHook/useMyOrder";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router";

const Orders = () => {
  const { data: orders = [], isLoading, isError, refetch } = useMyOrder();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>

        <p className="mt-1 text-gray-500">
          View and manage your recent purchases.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-red-500">Unable to load your orders.</p>

          <button
            onClick={() => refetch()}
            className="mt-3 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && orders.length === 0 && (
        <div className="rounded-xl border bg-white p-10 text-center">
          <ShoppingBag size={40} className="mx-auto mb-4 text-gray-400" />

          <h2 className="text-lg font-semibold">No orders yet</h2>

          <p className="mt-2 text-sm text-gray-500">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/store"
            className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {/* Orders list */}
      {!isLoading && !isError && orders.length > 0 && (
        <div className="space-y-4">
          {[...orders]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
