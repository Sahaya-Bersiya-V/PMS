import "./ExpenseStatusBadge.css";

const ExpenseStatusBadge = ({ status }) => {

    return (

        <span
            className={
                status === "Paid"
                    ? "expense-status paid"
                    : "expense-status pending"
            }
        >
            {status}
        </span>

    );

};

export default ExpenseStatusBadge;