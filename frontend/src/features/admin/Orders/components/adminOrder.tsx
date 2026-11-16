import { useMemo, useState } from "react";
import { Alert, Button, Input, Popconfirm, Select, Table } from "antd";
import type { TableColumnsType } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

import { formatCurrency } from "@/utils/formatCurrency";
import { formatOrderDate, getOrderStatus } from "@/utils/orderUtils";
import { useAllOrder } from "@/features/admin/Orders/hooks/useAllOrder";
import type { Order } from "@/features/orders/types/Order.types";
import { useConfirmOrder } from "../hooks/useConfirmOrder";

const AdminOrders = () => {
  const { data, isLoading, isError, refetch } = useAllOrder();
  const orders = (data ?? []) as Order[];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | undefined>(
    undefined,
  );

  // Filter orders based on search text and selected status.
  const filteredOrders = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !searchTerm ||
        order.id.toLowerCase().includes(searchTerm) ||
        order.shippingAddress.fullName.toLowerCase().includes(searchTerm) ||
        order.shippingAddress.city.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === undefined || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);
  const confirmOrderMutation = useConfirmOrder();
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
        <div>
          <p className="font-medium text-slate-800">
            {order.shippingAddress.fullName}
          </p>
          <p className="text-xs text-slate-500">
            {order.shippingAddress.city}, {order.shippingAddress.state}
          </p>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => formatOrderDate(date),
    },
    {
      title: "Items",
      key: "items",
      render: (_, order) =>
        order.items.reduce((total, item) => total + item.quantity, 0),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => (
        <span className="font-semibold">{formatCurrency(total)}</span>
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
    {
      title: "Actions",
      key: "actions",
      render: (_, order) => {
        if (order.status !== 0) {
          return <span className="text-slate-400">—</span>;
        }

        return (
          <Popconfirm
            title="Confirm this order?"
            description="This will update inventory and change the order status."
            okText="Confirm"
            cancelText="Cancel"
            onConfirm={() => confirmOrderMutation.mutate(order.id)}
          >
            <Button
              type="primary"
              size="small"
              loading={
                confirmOrderMutation.isPending &&
                confirmOrderMutation.variables === order.id
              }
              disabled={confirmOrderMutation.isPending}
            >
              Confirm
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Order Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage customer orders.
          </p>
        </div>

        <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          title="Unable to load orders"
          description="Please try again."
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      )}

      {!isError && (
        <>
          <div className="flex flex-wrap gap-3">
            <Input
              allowClear
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Search order ID, customer or city"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="max-w-md"
            />

            <Select
              allowClear
              placeholder="Filter by status"
              className="w-48"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: "Pending", value: 0 },
                { label: "Confirmed", value: 1 },
                { label: "Processing", value: 2 },
                { label: "Shipped", value: 3 },
                { label: "Delivered", value: 4 },
                { label: "Cancelled", value: 5 },
              ]}
            />
          </div>

          <div className="rounded-lg border border-slate-200">
            <Table<Order>
              rowKey="id"
              columns={columns}
              dataSource={filteredOrders}
              loading={isLoading}
              scroll={{ x: 800 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} orders`,
              }}
              locale={{
                emptyText:
                  search || statusFilter !== undefined
                    ? "No matching orders found"
                    : "No orders available",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
