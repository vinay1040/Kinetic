import { Alert, Card, Col, Row, Skeleton } from "antd";
import { IndianRupee, ShoppingCart, TrendingUp, Users } from "lucide-react";

import { useAdminDashboard } from "@/features/admin/dashboard/hooks/useAdminDashboard";
import { formatCurrency } from "@/utils/formatCurrency";

const StatisticCard = () => {
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  const statistics = [
    {
      title: "Total Revenue",
      value: data ? formatCurrency(data.totalRevenue) : "",
      description: "Excluding cancelled orders",
      icon: IndianRupee,
    },
    {
      title: "Total Orders",
      value: data?.totalOrders.toLocaleString("en-IN") ?? "",
      description: "All customer orders",
      icon: ShoppingCart,
    },
    {
      title: "Total Customers",
      value: data?.totalCustomers.toLocaleString("en-IN") ?? "",
      description: "Active registered customers",
      icon: Users,
    },
    {
      title: "Average Order Value",
      value: data ? formatCurrency(data.averageOrderValue) : "",
      description: "Excluding cancelled orders",
      icon: TrendingUp,
    },
  ];

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Unable to load dashboard statistics"
        action={
          <button onClick={() => refetch()} className="font-medium underline">
            Retry
          </button>
        }
      />
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {statistics.map((stat) => {
        const Icon = stat.icon;

        return (
          <Col xs={24} sm={12} xl={6} key={stat.title}>
            <Card
              className="h-full !rounded-xl !border-slate-200 !shadow-sm"
              styles={{ body: { padding: "20px" } }}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={21} strokeWidth={1.8} />
                </div>
              </div>

              {isLoading ? (
                <Skeleton
                  active
                  title={false}
                  paragraph={{ rows: 1, width: "75%" }}
                  className="mt-4"
                />
              ) : (
                <h2 className="mt-4 whitespace-nowrap text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {stat.value}
                </h2>
              )}

              <p className="mt-2 text-xs text-slate-400">{stat.description}</p>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default StatisticCard;
