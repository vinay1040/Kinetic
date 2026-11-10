
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button, Skeleton } from "antd";
import { RefreshCw } from "lucide-react";

import { formatCurrency } from "@/utils/formatCurrency";
import { useMontlyRevenue } from "@/hooks/AdminHook/RevenueHook/useMontlyRevenue";

const compactCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const RevenueChart = () => {
  const {
    data: revenue = [],
    isLoading,
    isError,
    refetch,
  } = useMontlyRevenue();

  const chartData = useMemo(
    () =>
      revenue.map((item) => ({
        month: new Date(
          item.year,
          item.month - 1
        ).toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        }),
        revenue: item.revenue,
      })),
    [revenue]
  );

  return (
    <div className="rounded-xl flex-2 border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Revenue Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Monthly revenue performance
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton active paragraph={{ rows: 0 }} />
          <Skeleton.Node active style={{ width: "100%", height: 280 }} />
        </div>
      ) : isError ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center gap-3">
          <p className="text-sm text-slate-500">
            Unable to load revenue data.
          </p>
          <Button
            icon={<RefreshCw size={14} />}
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex min-h-[280px] items-center justify-center">
          <p className="text-sm text-slate-500">
            No revenue data available yet.
          </p>
        </div>
      ) : (
        <div className="h-[280px] w-full sm:h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 5, bottom: 5 }}
              barCategoryGap="35%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickFormatter={(value) =>
                  compactCurrency.format(value)
                }
                width={75}
              />

              <Tooltip
                cursor={{ fill: "#F1F5F9" }}
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  "Revenue",
                ]}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  padding: "10px 14px",
                }}
              />

              <Bar
                dataKey="revenue"
                fill="#2563EB"
                radius={[5, 5, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
