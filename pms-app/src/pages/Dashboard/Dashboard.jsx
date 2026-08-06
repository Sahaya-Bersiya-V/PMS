import RoomCategory from "../RoomsOverview/components/RoomCategory";
import StatusLegend from "../RoomsOverview/components/StatusLegend";
import { roomCategories } from "../RoomsOverview/data";
import "./Dashboard.css";
import DailyRevenueChart from "./components/DailyRevenueChart";
import OccupancyChart from "./components/OccupancyChart";
import RevenueChart from "./components/RevenueChart";
import RoomCategoryModal from "./components/RoomCategoryModal";
import RoomStatusChart from "./components/RoomStatusChart";
import StatCard from "./components/StatCard";
import { dashboardStats } from "./data";
import { useState } from "react";

const colors=[
"#2563eb",
"#10b981",
"#f59e0b",
"#ef4444"
];
const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="dashboard">

      {/* <div className="stats-grid">
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
      </div> */}
      <div className="rooms-overview">

      <StatusLegend />

      {roomCategories.map((category) => (
        // <RoomCategory
        //   key={category.id}
        //   category={category}
        // />
        <RoomCategory
    key={category.id}
    category={category}
    onViewAll={(category)=>{

        setSelectedCategory(category);

        setIsModalOpen(true);

    }}
/>
      ))}


    </div>
      
    
      {/* <RevenueChart /> */}
      <div className="middle-grid">
  {/* <OccupancyChart /> */}
  {/* <RoomStatusChart /> */}

</div>
{/* <DailyRevenueChart /> */}

<RoomCategoryModal
    isOpen={isModalOpen}
    category={selectedCategory}
    onClose={() => setIsModalOpen(false)}
/>

    </div>
  );
};

export default Dashboard;