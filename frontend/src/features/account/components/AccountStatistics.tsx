import { useAddress } from "@/features/addresses/hooks/useAddress";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { useMyOrder } from "@/hooks/orders/useMyOrder";
import { ArrowRight, Heart, MapPin, ShoppingBag } from "lucide-react";
import { Link } from "react-router";
const formatStat = (count: number, isLoading?: boolean, isError?: boolean) => {
  if (isLoading) return "...";
  if (isError) return "—";
  return count;
};
export const AccountStatistics = () => {
  const {
    data: orders = [],
    isError: ordersError,
    isLoading: ordersLoading,
  } = useMyOrder();
  const {
    data: addresses = [],
    isLoading: addressesLoading,
    isError: addressesError,
  } = useAddress();
  const { wishlist } = useWishlist();
  const stats = [
    {
      label: "Orders",
      value: formatStat(orders.length, ordersLoading, ordersError),
      description: "Total purchases",
      linkText: "View orders",
      to: "/profile/orders",
      icon: ShoppingBag,
    },
    {
      label: "Wishlist",
      value: wishlist.length,
      description: "Saved products",
      linkText: "View wishlist",
      to: "/wishlist",
      icon: Heart,
    },
    {
      label: "Addresses",
      value: formatStat(addresses.length, addressesLoading, addressesError),
      description: "Saved delivery addresses",
      linkText: "Manage account",
      to: "/profile/settings",
      icon: MapPin,
      className: "sm:col-span-2 xl:col-span-1",
    },
  ];
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map(
        ({
          label,
          value,
          description,
          linkText,
          to,
          icon: Icon,
          className = "",
        }) => (
          <div
            key={label}
            className={`rounded-xl border-border bg-card p-4 transition-shadow hover:shadow-sm ${className}`}
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-muted p-3">
                <Icon size={21} className="text-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>

            <div className="mt-5">
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            </div>

            <Link
              to={to}
              className="mt-5 flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand-accent"
            >
              {linkText}
              <ArrowRight size={16} />
            </Link>
          </div>
        ),
      )}
    </section>
  );
};
