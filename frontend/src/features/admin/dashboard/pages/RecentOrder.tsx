import { Alert, Button, Skeleton, Table } from "antd";
import type { TableColumnsType } from "antd";
import { ArrowRight } from "lucide-react";

import type { Order } from "@/features/orders/services/Order";
import { useAllOrder } from "@/features/orders/hooks/useAllOrder";
import {
  formatCurrency,
  formatOrderDate,
  getOrderStatus,
} from "@/utils/orderUtils";
import { useNavigate } from "react-router";

const RecentOrders = () => {
  const navigate = useNavigate();

  const { data: orders = [], isLoading, isError, refetch } = useAllOrder();

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const columns: TableColumnsType<Order> = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => (
        <span className="font-semibold text-slate-800">
          #{id.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, order) => (
        <span className="font-medium text-slate-700">
          {order.shippingAddress.fullName}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-slate-500">{formatOrderDate(date)}</span>
      ),
    },
    {
      title: "Items",
      key: "items",
      render: (_, order) =>
        order.items.reduce((sum, item) => sum + item.quantity, 0),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => (
        <span className="font-semibold text-slate-800">
          {formatCurrency(total)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        const orderStatus = getOrderStatus(status);

        return (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${orderStatus.style}`}
          >
            {orderStatus.label}
          </span>
        );
      },
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Orders
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            The latest customer orders from your store
          </p>
        </div>

        <Button
          type="default"
          onClick={() => navigate("/admin/orders")}
          className="!flex !items-center !gap-2"
        >
          View all orders
          <ArrowRight size={15} />
        </Button>
      </div>

      <div className="p-4 sm:p-5">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : isError ? (
          <Alert
            type="error"
            showIcon
            message="Unable to load recent orders"
            action={
              <Button size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        ) : (
          <Table<Order>
            rowKey="id"
            columns={columns}
            dataSource={recentOrders}
            pagination={false}
            scroll={{ x: 700 }}
            locale={{
              emptyText: "No orders available yet.",
            }}
          />
        )}
      </div>
    </section>
  );
};

export default RecentOrders;
