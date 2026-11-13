import { Alert, Button, Skeleton } from "antd";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { RefreshCw } from "lucide-react";

import { formatCurrency } from "@/utils/formatCurrency";
import { useCategoriesRevenue } from "@/features/admin/revenue/hooks/useCategoriesRevenue";

const COLORS = [
  "#2563EB",
  "#7C3AED",
  "#0D9488",
  "#F59E0B",
  "#EC4899",
  "#64748B",
];

const TopCategories = () => {
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useCategoriesRevenue();

  const totalRevenue = categories.reduce(
    (total, category) => total + category.revenue,
    0,
  );

  const chartData = categories.map((category) => ({
    ...category,
    percentage: totalRevenue > 0 ? (category.revenue / totalRevenue) * 100 : 0,
  }));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      

      {isLoading ? (
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <Skeleton.Avatar active size={180} shape="circle" />
          <div className="w-full space-y-4">
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        </div>
      ) : isError ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3">
          <Alert
            type="error"
            showIcon
            message="Unable to load category revenue"
          />
          <Button icon={<RefreshCw size={14} />} onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      ) : chartData.length === 0 || totalRevenue <= 0 ? (
        <div className="flex min-h-[240px] items-center justify-center">
          <p className="text-sm text-slate-500">
            No category sales data available yet.
          </p>
        </div>
      ) : (
        <div className=" items-center gap-6 sm:flex-row">
          <div className="h-[220px] w-full max-w-[260px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.category}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    "Revenue",
                  ]}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full min-w-0 ">
            {chartData.map((category, index) => (
              <div
                key={category.category}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-sm"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                  <span className="truncate text-sm text-slate-600">
                    {category.category}
                  </span>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {category.percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatCurrency(category.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default TopCategories;
