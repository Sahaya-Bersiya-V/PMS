import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { occupancyData } from "../data";

import "./OccupancyChart.css";

const OccupancyChart = () => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Room Occupancy Trend</h3>
        <span>Last 7 Days</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={occupancyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="filled"
            stroke="#10b981"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="unfilled"
            stroke="#ef4444"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OccupancyChart;