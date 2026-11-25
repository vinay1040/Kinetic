
import { Alert, Button, Spin } from "antd";
import { ArrowLeft, Package } from "lucide-react";
import { Link, useParams } from "react-router";

import { formatCurrency } from "@/utils/formatCurrency";
import { formatOrderDate, getOrderStatus } from "@/utils/orderUtils";
import { useAdminOrderDetail } from "@/hooks/orders/useAdminOrderDetail";
import type { OrderItem } from "@/features/orders/types/Order.types";

interface AdminOrderItem {
  productId: string;
  thumbnail: string | null;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface AdminShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AdminOrder {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: AdminOrderItem[];
  shippingAddress: AdminShippingAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
}

interface AdminOrderDetailData {
  order: AdminOrder;
  customerName: string | null;
  customerEmail: string | null;
}

const AdminOrderDetail = () => {
  const { orderId = "" } = useParams();
  const { data, isLoading, isError, refetch, isFetching } =
    useAdminOrderDetail(orderId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Alert
          type="error"
          showIcon
          title="Unable to load order details"
          description="Please try again."
        />
        <Button onClick={() => refetch()} loading={isFetching}>
          Retry
        </Button>
      </div>
    );
  }

  if (!data) {
    return <Alert type="warning" message="Order not found." />;
  }

  const { order, customerName, customerEmail } = data;
  const status = getOrderStatus(order.status);

  return (
    <div className="space-y-4">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Order Details
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Order #{order.id}
        </p>
      </div>

      {/* Order information */}
      <section className="rounded-xl shadow bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-slate-800">
              Order Information
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Placed on {formatOrderDate(order.createdAt)}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${status.style}`}
          >
            {status.label}
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Order ID</p>
            <p className="mt-1 break-all font-medium">{order.id}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Last Updated</p>
            <p className="mt-1 font-medium">
              {formatOrderDate(order.updatedAt)}
            </p>
          </div>
        </div>
      </section>

      {/* Customer information */}
      <section className="rounded-xl shadow bg-white p-5">
        <h2 className="font-semibold text-slate-800">
          Customer Information
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Customer Name</p>
            <p className="mt-1 font-medium">
              {customerName || "Unavailable"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Email Address</p>
            <p className="mt-1 break-all font-medium">
              {customerEmail || "Unavailable"}
            </p>
          </div>
        </div>
      </section>

      {/* Ordered products */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b p-5">
          <h2 className="font-semibold text-slate-800">
            Ordered Products
          </h2>
        </div>

        <div className="divide-y">
          {order.items.map((item :OrderItem , index:AdminOrderDetailData) => (
            <div
              key={`${item.productId}-${index}`}
              className="flex flex-wrap items-center gap-4 p-5"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.productTitle}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <Package size={26} className="text-slate-400" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-800">
                  {item.productTitle}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm text-slate-500">
                  Unit price: {formatCurrency(item.unitPrice)}
                </p>
              </div>

              <p className="font-semibold">
                {formatCurrency(item.lineTotal)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Shipping and payment summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-800">
            Shipping Address
          </h2>

          <div className="mt-4 space-y-1 text-sm text-slate-600">
            <p className="font-medium text-slate-900">
              {order.shippingAddress.fullName}
            </p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p>{order.shippingAddress.addressLine2}</p>
            )}
            <p>
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-800">
            Order Summary
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Shipping</span>
              <span>{formatCurrency(order.shippingCost)}</span>
            </div>

            <div className="flex justify-between border-t pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
