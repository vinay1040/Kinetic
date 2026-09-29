import { orders } from "@/data/order";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useParams } from "react-router";

const OrderDetail = () => {
  const { orderId } = useParams();
  const order = orders.find((order) => order.id === orderId);

  if (!order) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Order Not Found</h1>

        <Link
          to="/profile/orders"
          className="inline-flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <Link
        to="/profile/orders"
        className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-black"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      <div>
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>

        <p className="mt-1 text-gray-500">Placed on {order.date}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Order Status</p>

            <p className="mt-1 font-semibold">{order.status}</p>
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
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b p-5">
          <h2 className="font-semibold">Products</h2>
        </div>

        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.product.id} className="flex gap-4 p-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50">
                <img
                  src={item.product.thumbnail}
                  alt={item.product.title}
                  className="h-full w-full object-contain p-2"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-medium">{item.product.title}</h3>

                <p className="mt-1 text-sm text-gray-500">
                  {item.product.brand}
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  ₹{item.product.price.toLocaleString("en-IN")}
                </p>

                <p className="mt-1 text-xs text-gray-500">× {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t p-5">
          <span className="font-semibold">Total</span>

          <span className="text-xl font-bold">
            ₹{order.total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
