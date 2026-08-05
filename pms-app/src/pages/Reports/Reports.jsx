import "./Reports.css";
import RevenueExpenseChart from "./components/RevenueExpenseChart";
import ReportStats from "./components/ReportStats";
import OccupancyTrendChart from "./components/OccupancyTrendChart";
import MonthlyRevenueChart from "./components/MonthlyRevenueChart";
import ReportsTable from "./components/ReportsTable";
import RoomOccupancyChart from "./components/RoomOccupancyChart"
const Reports = () => {

    return (

        <div className="reports-page">

            <ReportStats />

            <div className="reports-chart-grid">

                <RevenueExpenseChart />

                <OccupancyTrendChart />

            </div>

            <div className="reports-chart-grid">

                <RoomOccupancyChart />

                <MonthlyRevenueChart />

            </div>

            <ReportsTable />

        </div>

    );

};

export default Reports;