import {
    AreaChart,
    Area,
    ResponsiveContainer,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
} from "recharts";

import { revenueExpenseData } from "../data";

import "./RevenueExpenseChart.css";

const RevenueExpenseChart = () => {

    return (

        <div className="report-chart-card">

            <div className="chart-header">

                <h3>Revenue vs Expenses</h3>

                <p>Last 7 Months</p>

            </div>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <AreaChart data={revenueExpenseData}>

                    <defs>

                        <linearGradient
                            id="revenue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >

                            <stop
                                offset="5%"
                                stopColor="#2563eb"
                                stopOpacity={0.4}
                            />

                            <stop
                                offset="95%"
                                stopColor="#2563eb"
                                stopOpacity={0}
                            />

                        </linearGradient>

                        <linearGradient
                            id="expense"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >

                            <stop
                                offset="5%"
                                stopColor="#ef4444"
                                stopOpacity={0.4}
                            />

                            <stop
                                offset="95%"
                                stopColor="#ef4444"
                                stopOpacity={0}
                            />

                        </linearGradient>

                    </defs>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        fill="url(#revenue)"
                        strokeWidth={3}
                    />

                    <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#ef4444"
                        fill="url(#expense)"
                        strokeWidth={3}
                    />

                </AreaChart>

            </ResponsiveContainer>

        </div>

    );

};

export default RevenueExpenseChart;