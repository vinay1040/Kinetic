import RevenueChart from "../../revenue/components/RevenueChart";
import StatisticCard from "./StatisticCard";
import RecentOrders from "./RecentOrder";
import TopCategories from "../../revenue/components/TopCategoriesRevenue";

const AdminDashboard = () => {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-3">
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
