import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { roomStatusData } from "../data";

import "./RoomStatusChart.css";

const COLORS=[
"#3b82f6",
"#10b981",
"#f59e0b"
];
const RoomStatusChart = () => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Room Status</h3>
        <span>Current Status</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={roomStatusData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {roomStatusData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoomStatusChart;