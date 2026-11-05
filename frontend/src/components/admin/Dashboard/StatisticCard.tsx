import { useAdminDashboard } from "@/hooks/AdminHook/useAdminDashboard";
import { Alert, Card, Col, Row, Spin } from "antd";
import { IndianRupee, ShoppingCart, TrendingUp, Users } from "lucide-react";

export const StatisticCard = () => {
  const { data, isLoading, isError } = useAdminDashboard();

  const Statistic = [
    {
      title: "TOTAL REVENUE",
      value: `${data?.totalRevenue.toLocaleString("en-IN")}`,
      description: "Excluding cancelled orders",
      icon: IndianRupee,
    },
    {
      title: "TOTAL ORDERS",
      value: `${data?.totalOrders.toLocaleString("en-IN")}`,
      description: "All customer orders",
      icon: ShoppingCart,
    },
    {
      title: "TOTAL CUSTOMERS",
      value: `${data?.totalCustomers.toLocaleString("en-IN")}`,
      description: "Distinct customers",
      icon: Users,
    },
    {
      title: "AVERAGE ORDER VALUE",
      value: `${data?.averageOrderValue.toLocaleString("en-IN")}`,
      description: "Excluding cancelled orders",
      icon: TrendingUp,
    },
  ];
  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Alert type="error" message="Failed to load dashboard statistics." />
    );
  }
  return (
    <Row gutter={[16, 16]}>
      {Statistic.map((stat) => {
        const Icon = stat.icon;

        return (
          <Col xs={24} sm={12} xl={6} key={stat.title}>
            <Card className="h-full">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h2 className="mt-2 text-2xl font-semibold">{stat.value}</h2>
                </div>

                <div className="rounded-lg bg-gray-100 p-3">
                  <Icon size={22} />
                </div>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};
