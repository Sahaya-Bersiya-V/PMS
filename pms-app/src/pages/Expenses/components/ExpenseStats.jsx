import { FaMoneyBillWave, FaWallet, FaClock, FaTags } from "react-icons/fa";

import "./ExpenseStats.css";

const stats = [
    {
        title: "Today's Expenses",
        value: "₹12,500",
        icon: <FaMoneyBillWave />,
        color: "#2563eb",
    },
    {
        title: "Monthly Expenses",
        value: "₹3,42,500",
        icon: <FaWallet />,
        color: "#10b981",
    },
    {
        title: "Pending Payments",
        value: "₹18,000",
        icon: <FaClock />,
        color: "#f59e0b",
    },
    {
        title: "Expense Categories",
        value: "12",
        icon: <FaTags />,
        color: "#ef4444",
    },
];

const ExpenseStats = () => {

    return (

        <div className="expense-stats">

            {stats.map((item) => (

                <div
                    key={item.title}
                    className="expense-stat-card"
                    style={{ borderTop: `4px solid ${item.color}` }}
                >

                    <div className="stat-header">

                        <div>

                            <h4>{item.title}</h4>

                            <h2>{item.value}</h2>

                        </div>

                        <div
                            className="stat-icon"
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

export default ExpenseStats;