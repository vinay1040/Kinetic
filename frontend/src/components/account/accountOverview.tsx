import { Link } from "react-router";
import { ArrowRight, Heart, MapPin, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

const AccountOverview = () => {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name}
        </h1>

        <p className="mt-1 text-gray-500">
          Manage your account and view your recent activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <ShoppingBag size={22} />
            <span className="text-sm text-gray-500">Orders</span>
          </div>

          <p className="text-2xl font-bold">5</p>

          <p className="mt-1 text-sm text-gray-500">
            Total orders
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <Heart size={22} />
            <span className="text-sm text-gray-500">Wishlist</span>
          </div>

          <p className="text-2xl font-bold">{wishlist.length}</p>

          <p className="mt-1 text-sm text-gray-500">
            Saved products
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <MapPin size={22} />
            <span className="text-sm text-gray-500">Address</span>
          </div>

          <p className="text-2xl font-bold">
            {user?.address ? "Added" : "Not added"}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Delivery address
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="font-semibold">Recent Orders</h2>
            <p className="text-sm text-gray-500">
              Your latest purchases
            </p>
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
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="font-medium">Order #KIN-1001</p>
              <p className="text-sm text-gray-500">
                2 items · ₹24,999
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Delivered
            </span>
          </div>

          <div className="flex items-center justify-between p-5">
            <div>
              <p className="font-medium">Order #KIN-1002</p>
              <p className="text-sm text-gray-500">
                1 item · ₹8,499
              </p>
            </div>

            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
              Processing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;