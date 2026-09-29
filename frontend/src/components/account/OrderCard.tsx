import { Link } from "react-router";
import { Package } from "lucide-react";
import type { Product } from "@/services/productApi";

export type OrderItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  date: string;
  status: "Delivered" | "Processing";
  items: OrderItem[];
  total: number;
};

type OrderCardProps = {
  order: Order;
};

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-3">
            <Package size={20} />
          </div>

          <div>
            <h2 className="font-semibold">
              Order #{order.id}
            </h2>

            <p className="text-sm text-gray-500">
              {order.date} · {order.items.length}{" "}
              {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            order.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <div>
          <p className="text-sm text-gray-500">Total</p>

          <p className="font-semibold">
            ₹{order.total.toLocaleString("en-IN")}
          </p>
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