import {
    FaChartLine,
    FaMoneyBillWave,
    FaWallet,
    FaHotel
} from "react-icons/fa";

import "./ReportStats.css";

const reportStats = [

    {
        title: "Total Revenue",
        value: "₹12,45,000",
        subtitle: "This Month",
        icon: <FaChartLine />,
        color: "#2563eb",
    },

    {
        title: "Total Expenses",
        value: "₹4,35,000",
        subtitle: "This Month",
        icon: <FaMoneyBillWave />,
        color: "#ef4444",
    },

    {
        title: "Net Profit",
        value: "₹8,10,000",
        subtitle: "65% Margin",
        icon: <FaWallet />,
        color: "#10b981",
    },

    {
        title: "Occupancy Rate",
        value: "82%",
        subtitle: "Today's Occupancy",
        icon: <FaHotel />,
        color: "#f59e0b",
    }

];

const ReportStats = () => {

    return (

        <div className="report-stats-grid">

            {reportStats.map((item) => (

                <div
                    key={item.title}
                    className="report-stat-card"
                    style={{ borderTop: `4px solid ${item.color}` }}
                >

                    <div className="report-stat-header">

                        <div>

                            <p>{item.title}</p>

                            <h2>{item.value}</h2>

                            <span>{item.subtitle}</span>

                        </div>

                        <div
                            className="report-stat-icon"
                            style={{ color: item.color }}
                        >
                            {item.icon}
                        </div>

                    </div>

                </div>

            ))}

        </div>

    );

};

export default ReportStats;