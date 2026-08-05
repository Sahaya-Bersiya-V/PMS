import { useState } from "react";

import "./Expenses.css";

import expenseData from "./data";

import ExpenseToolbar from "./components/ExpenseToolbar";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseStats from "./components/ExpenseStats";

const Expenses = () => {

    const [expenses] = useState(expenseData);

    return (

        <div className="expenses-page">
            <ExpenseStats />
            <ExpenseToolbar />

            <ExpenseTable expenses={expenses} />

        </div>

    );

};

export default Expenses;