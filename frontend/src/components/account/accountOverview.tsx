import { Link } from "react-router";
import { ArrowRight, Heart, MapPin, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { useMyOrder } from "@/features/orders/hooks/useMyOrder";
import { useAddress } from "@/features/addresses/hooks/useAddress";
import OrderCard from "./OrderCard";

const AccountOverview = () => {
  const { wishlist } = useWishlist();

  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
  } = useMyOrder();

  const {
    data: addresses = [],
    isLoading: addressesLoading,
    isError: addressesError,
  } = useAddress();

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Account Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <ShoppingBag size={22} />
            <span className="text-sm text-gray-500">Orders</span>
          </div>

          <p className="text-2xl font-bold">
            {ordersLoading ? "..." : ordersError ? "—" : orders.length}
          </p>

          <p className="mt-1 text-sm text-gray-500">Total orders</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <Heart size={22} />
            <span className="text-sm text-gray-500">Wishlist</span>
          </div>

          <p className="text-2xl font-bold">{wishlist.length}</p>

          <p className="mt-1 text-sm text-gray-500">Saved products</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <MapPin size={22} />
            <span className="text-sm text-gray-500">Addresses</span>
          </div>

          <p className="text-2xl font-bold">
            {addressesLoading ? "..." : addressesError ? "—" : addresses.length}
          </p>

          <p className="mt-1 text-sm text-gray-500">Delivery addresses</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="font-semibold">Recent Orders</h2>
            <p className="text-sm text-gray-500">Your latest purchases</p>
          </div>

          <Link
            to="/profile/orders"
            className="flex items-center gap-1 text-sm font-medium"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="divide-y">
          {ordersLoading && (
            <p className="p-5 text-sm text-gray-500">Loading your orders...</p>
          )}

          {ordersError && (
            <p className="p-5 text-sm text-red-500">
              Unable to load your orders. Please try again.
            </p>
          )}

          {!ordersLoading && !ordersError && recentOrders.length === 0 && (
            <div className="p-8 text-center">
              <ShoppingBag size={32} className="mx-auto mb-3 text-gray-400" />

              <p className="font-medium">No orders yet</p>

              <p className="mt-1 text-sm text-gray-500">
                Your recent purchases will appear here.
              </p>

              <Link
                to="/store"
                className="mt-4 inline-block text-sm font-medium text-primary"
              >
                Start shopping
              </Link>
            </div>
          )}

          {!ordersLoading &&
            !ordersError &&
            recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
