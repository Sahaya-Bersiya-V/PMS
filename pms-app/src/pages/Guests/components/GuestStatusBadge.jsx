import "./GuestStatusBadge.css";

const GuestStatusBadge = ({ status }) => {

    return (
        <span
            className={
                status === "Active"
                    ? "guest-status active"
                    : "guest-status inactive"
            }
        >
            {status}
        </span>
    );

};

export default GuestStatusBadge;