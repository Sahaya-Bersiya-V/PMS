import "./RoomTypeStatusBadge.css";

const RoomTypeStatusBadge = ({ status }) => {

    return (

        <span
            className={
                status === "Active"
                    ? "type-status active"
                    : "type-status inactive"
            }
        >
            {status}
        </span>

    );

};

export default RoomTypeStatusBadge;