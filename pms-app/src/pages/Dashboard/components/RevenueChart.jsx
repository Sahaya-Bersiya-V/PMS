import {
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { revenueData } from "../data";

import "./RevenueChart.css";

const RevenueChart = () => {
  return (
    <div className="chart-card">

      <div className="chart-header">
        <h3>Cumulative Revenue</h3>
        <span>Last 30 Days</span>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={revenueData}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
stroke="#e2e8f0"
strokeDasharray="4 4"
/>

          <XAxis dataKey="day" />

          <YAxis
tickFormatter={(value)=>`₹${value/1000}K`}
/>

          <Tooltip
contentStyle={{
background:"#ffffff",
borderRadius:"12px",
border:"none",
boxShadow:"0 10px 25px rgba(0,0,0,.12)"
}}
/>

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={3}
            fill="url(#revenueFill)"
          />
        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
};

export default RevenueChart;