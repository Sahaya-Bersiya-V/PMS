import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

import {roomOccupancyData} from "../data"
import "./RoomOccupancychart.css"

const COLORS = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
   
];

const BookingSourceChart = () => {

    return (

        <div className="report-chart-card">

            <div className="chart-header">

                <h3>Room Occupancy</h3>

                <p>Current Status</p>

            </div>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <PieChart>

                    <Pie
                        data={roomOccupancyData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label
                    >

                        {roomOccupancyData.map((entry, index) => (

                            <Cell
                                key={index}
                                fill={COLORS[index]}
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

export default BookingSourceChart;