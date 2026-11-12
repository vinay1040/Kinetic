import { Link } from "react-router";
import { Package } from "lucide-react";
import type { Order } from "@/services/Order";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatOrderDate, getOrderStatus } from "@/utils/orderUtils";

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
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-3">
            <Package size={20} />
          </div>

          <div>
            <h2 className="font-semibold">Order #{order.id}</h2>

            <p className="text-sm text-gray-500">
              {formatOrderDate(order.createdAt)} · {totalItems}{" "}
              {totalItems === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${status.style}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="font-semibold">{formatCurrency(order.total)}</p>
        </div>

        <Link
          to={`/profile/orders/${order.id}`}
          className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
        >
          View Order
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
