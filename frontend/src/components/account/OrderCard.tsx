import { Link } from "react-router";
import { Package } from "lucide-react";
import type { Order } from "@/services/Order";

const getOrderStatus = (status: number) => {
  const statuses = [
    { label: "Pending", style: "bg-yellow-100 text-yellow-700" },
    { label: "Confirmed", style: "bg-blue-100 text-blue-700" },
    { label: "Processing", style: "bg-yellow-100 text-yellow-700" },
    { label: "Shipped", style: "bg-purple-100 text-purple-700" },
    { label: "Delivered", style: "bg-green-100 text-green-700" },
    { label: "Cancelled", style: "bg-red-100 text-red-700" },
  ];

  return (
    statuses[status] ?? {
      label: "Unknown",
      style: "bg-gray-100 text-gray-700",
    }
  );
};

const OrderCard = ({ order }: { order: Order }) => {
  const status = getOrderStatus(order.status);

  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(order.total);

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
              {formattedDate} · {totalItems}{" "}
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

          <p className="font-semibold">{formattedTotal}</p>
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