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

import { formatCurrency } from "@/utils/formatCurrency";
import { useMontlyRevenue } from "@/hooks/AdminHook/useMontlyRevenue";

const RevenueChart = () => {
  const {
    data: revenue = [],
    isLoading,
    isError,
    refetch,
  } = useMontlyRevenue();

  // Transform API data into chart-friendly data.
  const chartData = useMemo(() => {
    return revenue.map((item) => ({
      month: new Date(item.year, item.month - 1).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      }),
      revenue: item.revenue,
    }));
  }, [revenue]);

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <p className="text-slate-500">Loading revenue data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-80 flex-col items-center justify-center gap-3">
        <p className="text-red-500">Unable to load revenue data.</p>
        <button
          onClick={() => refetch()}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Revenue Overview
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Monthly revenue performance
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-slate-500">
          No revenue data available yet.
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />

              <Tooltip
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  "Revenue",
                ]}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                }}
              />

              <Bar
                dataKey="revenue"
                fill="#2563eb"
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
