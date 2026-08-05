import "./RoleStatusBadge.css";

const RoleStatusBadge = ({ status }) => {

    return (
        <span
            className={
                status === "Active"
                    ? "role-status active"
                    : "role-status inactive"
            }
        >
            {status}
        </span>
    );

};

export default RoleStatusBadge;