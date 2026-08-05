import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { dailyRevenueData } from "../data";

import "./DailyRevenueChart.css";

const DailyRevenueChart = () => {
  return (
    <div className="chart-card">

      <div className="chart-header">
        <h3>Daily Revenue</h3>
        <span>Last 14 Days</span>
      </div>

      <ResponsiveContainer width="100%" height={330}>
        <BarChart data={dailyRevenueData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="revenue"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default DailyRevenueChart;