import "./Dashboard.css";
import DailyRevenueChart from "./components/DailyRevenueChart";
import OccupancyChart from "./components/OccupancyChart";
import RevenueChart from "./components/RevenueChart";
import RoomStatusChart from "./components/RoomStatusChart";
import StatCard from "./components/StatCard";
import { dashboardStats } from "./data";
const colors=[
"#2563eb",
"#10b981",
"#f59e0b",
"#ef4444"
];
const Dashboard = () => {
  return (
    <div className="dashboard">

      <div className="stats-grid">
        {dashboardStats.map((card,index) => (
          <StatCard
            key={card.id}
            title={card.title}
            value={card.value}
            trend={card.trend}
            trendType={card.trendType}
            icon={card.icon}
            color={colors[index]}
          />
        ))}
      </div>
      
    
      <RevenueChart />
      <div className="middle-grid">
  <OccupancyChart />
  <RoomStatusChart />

</div>
<DailyRevenueChart />

    </div>
  );
};

export default Dashboard;