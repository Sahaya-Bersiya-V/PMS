import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import { occupancyTrendData } from "../data";

import "./OccupancyTrendChart.css";

const OccupancyTrendChart = () => {

    return (

        <div className="report-chart-card">

            <div className="chart-header">

                <h3>Occupancy Trend</h3>

                <p>Last 7 Days</p>

            </div>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <LineChart
                    data={occupancyTrendData}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis dataKey="day" />

                    <YAxis
                        unit="%"
                        domain={[0, 100]}
                    />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="occupancy"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

};

export default OccupancyTrendChart;