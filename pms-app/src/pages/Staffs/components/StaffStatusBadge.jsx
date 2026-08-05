import "./StaffStatusBadge.css";

const StaffStatusBadge = ({ status }) => {

    return (

        <span
            className={
                status === "Active"
                    ? "staff-status active"
                    : "staff-status inactive"
            }
        >
            {status}
        </span>

    );

};

export default StaffStatusBadge;