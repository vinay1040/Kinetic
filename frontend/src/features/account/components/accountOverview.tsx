import { Link, useNavigate } from "react-router";
import {
  ArrowRight,
  LogOut,
  Pencil,
  ShoppingBag,
} from "lucide-react";

import { useMyOrder } from "@/hooks/orders/useMyOrder";

import OrderCard from "../../orders/components/OrderCard";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useState } from "react";
import { Modal } from "antd";
import { ProfileForm } from "@/features/auth/components/profile-form";
import { AccountStatistics } from "./AccountStatistics";

const AccountOverview = () => {
  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
  } = useMyOrder();

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
    <div className="space-y-4">
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
      <AccountStatistics/>

      {/* Recent orders */}
      <section className="overflow-hidden ">
        {/* Section heading */}
        <div className="flex flex-col gap-3 rounded-xl bg-card p-5 mb-2 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
        <div className="space-y-4 flex flex-col gap-4">
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
