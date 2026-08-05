import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import { monthlyRevenueData } from "../data";

import "./MonthlyRevenueChart.css";

const MonthlyRevenueChart = () => {

    return (

        <div className="report-chart-card">

            <div className="chart-header">

                <h3>Monthly Revenue</h3>

                <p>Last 7 Months</p>

            </div>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <BarChart
                    data={monthlyRevenueData}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip
                        formatter={(value) => [
                            `₹${value.toLocaleString()}`,
                            "Revenue",
                        ]}
                    />

                    <Bar
                        dataKey="revenue"
                        fill="#2563eb"
                        radius={[8, 8, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

};

export default MonthlyRevenueChart;