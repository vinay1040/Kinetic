import { Link, useNavigate } from "react-router";
import { ArrowRight, Heart, LogOut, MapPin, Pencil, ShoppingBag } from "lucide-react";

import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { useMyOrder } from "@/features/orders/hooks/useMyOrder";
import { useAddress } from "@/features/addresses/hooks/useAddress";

import OrderCard from "../../orders/components/OrderCard";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useState } from "react";
import { Modal } from "antd";
import { ProfileForm } from "@/features/auth/components/profile-form";

const AccountOverview = () => {
  // Customer wishlist
  const { wishlist } = useWishlist();

  // Customer orders
  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
  } = useMyOrder();

  // Customer saved addresses
  const {
    data: addresses = [],
    isLoading: addressesLoading,
    isError: addressesError,
  } = useAddress();

  // Get the three most recent orders
  const recentOrders = [...orders]
    .sort(
      (firstOrder, secondOrder) =>
        new Date(secondOrder.createdAt).getTime() -
        new Date(firstOrder.createdAt).getTime(),
    )
    .slice(0, 3);
  const { user } = useAuth();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const profileInitials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .map((namePart) => namePart[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U";
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };
  return (
    <div className="space-y-8">
      {/* Mobile profile header */}
      <section className="flex flex-col items-center justify-center py-6 text-center md:hidden">
        <div className="relative">
          <div className="flex size-24 items-center justify-center rounded-full border-4 border-white bg-[#DAE2FD] text-2xl font-semibold text-[#004AC6] shadow-sm">
            {profileInitials}
          </div>

          <button
            type="button"
            aria-label="Edit profile"
            onClick={() => setIsProfileModalOpen(true)}
            className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full bg-[#004AC6] text-white shadow-md transition-transform active:scale-95"
          >
            <Pencil size={16} />
          </button>
        </div>

        <h1 className="mt-4 text-2xl font-semibold text-[#0B1C30]">
          {user?.name || "My Account"}
        </h1>

        <p className="mt-1 text-sm text-[#434655]">{user?.email}</p>
      </section>
      {/* Account statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Account Summary
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            A quick look at your account activity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {/* Orders statistic */}
          <div className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-muted p-3">
                <ShoppingBag size={21} className="text-foreground" />
              </div>

              <span className="text-sm text-muted-foreground">Orders</span>
            </div>

            <div className="mt-5">
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {ordersLoading ? "..." : ordersError ? "—" : orders.length}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Total purchases
              </p>
            </div>

            <Link
              to="/profile/orders"
              className="mt-5 flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand-accent"
            >
              View orders
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Wishlist statistic */}
          <div className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-muted p-3">
                <Heart size={21} className="text-foreground" />
              </div>

              <span className="text-sm text-muted-foreground">Wishlist</span>
            </div>

            <div className="mt-5">
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {wishlist.length}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Saved products
              </p>
            </div>

            <Link
              to="/wishlist"
              className="mt-5 flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand-accent"
            >
              View wishlist
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Addresses statistic */}
          <div className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-muted p-3">
                <MapPin size={21} className="text-foreground" />
              </div>

              <span className="text-sm text-muted-foreground">Addresses</span>
            </div>

            <div className="mt-5">
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {addressesLoading
                  ? "..."
                  : addressesError
                    ? "—"
                    : addresses.length}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Saved delivery addresses
              </p>
            </div>

            <Link
              to="/profile/settings"
              className="mt-5 flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand-accent"
            >
              Manage account
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent orders */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Section heading */}
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Keep track of your latest purchases.
            </p>
          </div>

          <Link
            to="/profile/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand-accent"
          >
            View all orders
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Orders content */}
        <div className="space-y-4 p-4 sm:p-6">
          {/* Loading state */}
          {ordersLoading && (
            <div className="space-y-3" aria-label="Loading orders">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-xl border border-border p-5"
                >
                  <div className="h-4 w-40 rounded bg-muted" />
                  <div className="mt-3 h-3 w-28 rounded bg-muted" />
                  <div className="mt-6 h-8 w-full rounded bg-muted" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {ordersError && (
            <div className="rounded-lg bg-red-50 p-5 text-center">
              <p className="font-medium text-red-700">
                Unable to load your orders.
              </p>

              <p className="mt-1 text-sm text-red-600">
                Please try again later.
              </p>
            </div>
          )}

          {/* Empty state */}
          {!ordersLoading && !ordersError && recentOrders.length === 0 && (
            <div className="flex flex-col items-center px-4 py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <ShoppingBag size={28} className="text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold text-foreground">
                No orders yet
              </h3>

              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                You haven't placed any orders yet. Explore our store and find
                something you like.
              </p>

              <Link
                to="/store"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Explore Store
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* Recent order list */}
          {!ordersLoading && !ordersError && recentOrders.length > 0 && (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Modal
        title="Edit Profile"
        open={isProfileModalOpen}
        onCancel={() => setIsProfileModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <ProfileForm onCancel={() => setIsProfileModalOpen(false)} />
      </Modal>
      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-xl bg-surface-container px-4 py-4 text-left transition hover:bg-surface-variant md:hidden"
      >
        <LogOut size={20} className="text-destructive" />

        <span className="font-medium text-destructive">Log Out</span>
      </button>
    </div>
  );
};

export default AccountOverview;
