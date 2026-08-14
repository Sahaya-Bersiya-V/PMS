import "./RoomTypeStatusBadge.css";


const RoomTypeStatusBadge = ({
    status
}) => {

    const normalizedStatus =
        String(status || "")
            .toLowerCase();


    const isActive =
        normalizedStatus === "active";


    return (

        <span
            className={
                isActive
                    ? "type-status active"
                    : "type-status inactive"
            }
        >

            <span className="status-dot"></span>

            {isActive
                ? "Active"
                : "Inactive"
            }

        </span>

    );

};

export default RoomTypeStatusBadge;