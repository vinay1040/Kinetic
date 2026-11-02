import { Link } from "react-router";
import { ArrowRight, Heart, MapPin, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useMyOrder } from "@/hooks/OrderHook/useMyOrder";
import { useAddress } from "@/hooks/AddressHook/useAddress";
import OrderCard from "./OrderCard";
export const statuses = [
    { label: "Pending", style: "bg-yellow-100 text-yellow-700" },
    { label: "Confirmed", style: "bg-blue-100 text-blue-700" },
    { label: "Processing", style: "bg-yellow-100 text-yellow-700" },
    { label: "Shipped", style: "bg-purple-100 text-purple-700" },
    { label: "Delivered", style: "bg-green-100 text-green-700" },
    { label: "Cancelled", style: "bg-red-100 text-red-700" },
  ];
// const getOrderStatus = (status: number) => {
  
//   return (
//     statuses[status] ?? {
//       label: "Unknown",
//       style: "bg-gray-100 text-gray-700",
//     }
//   );
// };

// const formatCurrency = (amount: number) => {
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 2,
//   }).format(amount);
// };

// const formatDate = (date: string) => {
//   return new Date(date).toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// };

const AccountOverview = () => {
  const { user } = useAuth();
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

  const recentOrder = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <ShoppingBag size={22} />
            <span className="text-sm text-gray-500">Orders</span>
          </div>

          <p className="text-2xl font-bold">
            {ordersLoading ? "..." : ordersError ? "-" : orders.length}
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
            {addressesLoading
              ? "..."
              : addressesError
                ? "—"
                : addresses.length}{" "}
          </p>

          <p className="mt-1 text-sm text-gray-500">Delivery address</p>
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
          {!ordersLoading && !ordersError && recentOrder.length === 0 && (
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
            recentOrder.map((items) => {
              return (
                <OrderCard key={items.id} order={items}></OrderCard>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
