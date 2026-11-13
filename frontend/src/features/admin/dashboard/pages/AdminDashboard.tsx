import { Button } from "antd";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import RevenueChart from "../../revenue/components/RevenueChart";
import StatisticCard from "./StatisticCard";
import RecentOrders from "./RecentOrder";
import TopCategories from "../../revenue/components/TopCategoriesRevenue";

const AdminDashboard = () => {
  const queryClient = useQueryClient();

  // const handleRefresh = () => {
  //   queryClient.invalidateQueries({
  //     queryKey: ["admin", "dashboard"],
  //   });

  //   queryClient.invalidateQueries({
  //     queryKey: ["admin", "monthly-revenue"],
  //   });

  //   queryClient.invalidateQueries({
  //     queryKey: ["admin", "category-revenue"],
  //   });

  //   queryClient.invalidateQueries({
  //     queryKey: ["orders", "admin"],
  //   });
  // };

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-3">
      {/* Page heading */}
      {/* <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor your store performance and business activity.
          </p>
        </div>

        <Button onClick={handleRefresh}>
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div> */}

      {/* Statistics */}
      <section>
        <StatisticCard />
      </section>

      {/* Revenue */}
      <section className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <RevenueChart />
        <TopCategories />
      </section>
      <section>
        <RecentOrders />
      </section>
    </div>
  );
};

export default AdminDashboard;
