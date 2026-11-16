
import { Link } from "react-router";
import { Package } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatOrderDate, getOrderStatus } from "@/utils/orderUtils";
import type { Order } from "../types/Order.types";

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const status = getOrderStatus(order.status);
  const items = Array.isArray(order.items) ? order.items : [];

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <article className="rounded-xl bg-surface-container p-4 shadow-sm">
      {/* Order information */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 font-mono text-[11px] font-medium tracking-wide text-muted-foreground">
            ORDER #{order.id}
          </p>

          <p className="text-sm font-medium text-foreground">
            {formatOrderDate(order.createdAt)}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 font-mono text-[10px] font-medium ${status.style}`}
        >
          {status.label}
        </span>
      </div>

      {/* Products and total */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center">
          {items.slice(0, 3).map((item, index) => (
            <img
              key={item.productId}
              src={item.thumbnail}
              alt={item.productTitle}
              className={`relative h-10 w-10 rounded-full border-2 border-surface-container bg-surface-variant object-cover ${
                index > 0 ? "-ml-3" : ""
              }`}
              style={{ zIndex: 3 - index }}
            />
          ))}

          {items.length > 3 && (
            <span className="-ml-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface-container bg-surface-variant font-mono text-[10px] text-muted-foreground">
              +{items.length - 3}
            </span>
          )}

          {items.length === 0 && (
            <Package size={22} className="text-muted-foreground" />
          )}
        </div>

        <p className="shrink-0 text-lg font-semibold text-foreground">
          {formatCurrency(order.total)}
        </p>
      </div>

      {/* Order action */}
      <div className="mt-4">
        <Link
          to={`/profile/orders/${order.id}`}
          className="block rounded-lg bg-surface px-3 py-2 text-center text-xs font-semibold text-primary transition hover:bg-surface-variant"
        >
          View Order
        </Link>
      </div>
    </article>
  );
};

export default OrderCard;