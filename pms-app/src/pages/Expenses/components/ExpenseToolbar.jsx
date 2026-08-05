import { FaPlus, FaSearch } from "react-icons/fa";

import "./ExpenseToolbar.css";

const ExpenseToolbar = () => {

    return (

        <div className="expense-toolbar">

            <div className="toolbar-left">

                <div className="search-box">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search Expense..."
                    />

                </div>

                <select>

                    <option>All Categories</option>

                    <option>Electricity</option>

                    <option>Salary</option>

                    <option>Laundry</option>

                    <option>Maintenance</option>

                    <option>Food</option>

                </select>

                <select>

                    <option>This Month</option>

                    <option>Last Month</option>

                    <option>This Year</option>

                </select>

            </div>

            <button className="add-expense-btn">

                <FaPlus />

                Add Expense

            </button>

        </div>

    );

};

export default ExpenseToolbar;