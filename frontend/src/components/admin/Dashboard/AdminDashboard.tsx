import RevenueChart from "./RevenueChart";
import { StatisticCard } from "./StatisticCard";

const AdminDashboard = () => {
  return (
    <div className="space-y-7">

      {/* Statistic cards */}
      <StatisticCard/>
      {/*Revenue Chart */}
      <RevenueChart/>
    </div>
  );
};

export default AdminDashboard;
