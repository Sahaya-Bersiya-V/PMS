import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";

import "./ExpenseTable.css";
import ExpenseStatusBadge from "./ExpenseStatusBadge";

const ExpenseTable = ({ expenses }) => {

    return (

        <div className="expense-table-container">

            <table className="expense-table">

                <thead>

                    <tr>

                        <th>Date</th>

                        <th>Category</th>

                        <th>Description</th>

                        <th>Amount</th>

                        <th>Payment Mode</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {expenses.map((expense) => (

                        <tr key={expense.id}>

                            <td>{expense.date}</td>

                            <td>{expense.category}</td>

                            <td>{expense.description}</td>

                            <td className="amount-cell">
                                ₹{expense.amount.toLocaleString()}
                            </td>

                            <td>{expense.paymentMode}</td>

                            <td>

                                <ExpenseStatusBadge
                                    status={expense.status}
                                />

                            </td>

                            <td>

                                <div className="expense-actions">

                                    <button className="view-btn">
                                        <MdVisibility />
                                    </button>

                                    <button className="edit-btn">
                                        {/* <MdEdit /> */}
                                        ✏️
                                    </button>

                                    <button className="delete-btn">
                                        <MdDelete />
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

};

export default ExpenseTable;