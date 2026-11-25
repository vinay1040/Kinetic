import { useMemo, useState } from "react";
import { Alert, Button, Input, Popconfirm, Select, Table } from "antd";
import type { TableColumnsType } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { formatCurrency } from "@/utils/formatCurrency";
import { formatOrderDate, getOrderStatus } from "@/utils/orderUtils";
import { useAllOrder } from "@/hooks/orders/useAllOrder";
import type { Order } from "@/features/orders/types/Order.types";
import { useConfirmOrder } from "../../../../hooks/orders/useConfirmOrder";
import { Link } from "react-router";

const AdminOrders = () => {
  const { data, isLoading, isError, refetch } = useAllOrder();
  const orders = (data ?? []) as Order[];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | undefined>(
    undefined,
  );

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
      render: (_, order) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/orders/${encodeURIComponent(order.id)}`}>
            <Button size="small">View Details</Button>
          </Link>

          {order.status === 0 && (
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
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
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
              scroll={{ x: true, y: "calc(100vh - 280px)" }}
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
