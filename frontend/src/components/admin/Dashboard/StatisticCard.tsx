import { useAllOrder } from "@/hooks/CustomerHook/OrderHook/useAllOrder";
import { formatCurrency } from "@/utils/formatCurrency";
import { Alert, Card, Col, Row, Spin } from "antd";
import { IndianRupee, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";

export const StatisticCard = () => {
  const { data: orders = [], isLoading, isError, refetch } = useAllOrder();

  const stats = useMemo(() => {
    const validOrders = orders.filter((order) => order.status !== 5);

    const totalOrderValue = validOrders.reduce(
      (total, order) => total + order.total,
      0,
    );

    const totalOrders = orders.length;

    const customers = new Set(orders.map((order) => order.userId));

    const averageOrderValue =
      validOrders.length > 0 ? totalOrderValue / validOrders.length : 0;

    return [
      {
        title: "TOTAL ORDER VALUE",
        value: formatCurrency(totalOrderValue),
        description: "Excluding cancelled orders",
        icon: IndianRupee,
      },
      {
        title: "TOTAL ORDERS",
        value: totalOrders.toLocaleString("en-IN"),
        description: "All customer orders",
        icon: ShoppingCart,
      },
      {
        title: "CUSTOMERS WITH ORDERS",
        value: customers.size.toLocaleString("en-IN"),
        description: "Distinct customers",
        icon: Users,
      },
      {
        title: "AVERAGE ORDER VALUE",
        value: formatCurrency(averageOrderValue),
        description: "Excluding cancelled orders",
        icon: TrendingUp,
      },
    ];
  }, [orders]);

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Unable to load dashboard data"
        action={
          <button onClick={() => refetch()} className="font-semibold">
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Col xs={24} sm={12} xl={6} key={stat.title}>
              <Card
                className="h-full !rounded-xl !border-slate-200"
                styles={{ body: { padding: 20 } }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-400">
                      {stat.title}
                    </p>

                    <h2 className="mt-3 text-2xl font-bold text-slate-900">
                      {stat.value}
                    </h2>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                    <Icon size={20} />
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                  {stat.description}
                </p>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};


