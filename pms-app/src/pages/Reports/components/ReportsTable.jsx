import "./ReportsTable.css";

import { reportsTableData } from "../data";

const ReportsTable = () => {

    return (

        <div className="reports-table-card">

            <div className="reports-table-header">

                <h3>Daily Performance Report</h3>

                <p>Last 5 Days</p>

            </div>

            <table className="reports-table">

                <thead>

                    <tr>

                        <th>Date</th>

                        <th>Revenue</th>

                        <th>Expenses</th>

                        <th>Profit</th>

                        <th>Occupancy</th>

                        <th>Check-In</th>

                        <th>Check-Out</th>

                    </tr>

                </thead>

                <tbody>

                    {reportsTableData.map((report) => {

                        const profit =
                            report.revenue - report.expenses;

                        return (

                            <tr key={report.id}>

                                <td>{report.date}</td>

                                <td>
                                    ₹{report.revenue.toLocaleString()}
                                </td>

                                <td>
                                    ₹{report.expenses.toLocaleString()}
                                </td>

                                <td className="profit-cell">
                                    ₹{profit.toLocaleString()}
                                </td>

                                <td>{report.occupancy}</td>

                                <td>{report.checkIns}</td>

                                <td>{report.checkOuts}</td>

                            </tr>

                        );

                    })}

                </tbody>

            </table>

        </div>

    );

};

export default ReportsTable;