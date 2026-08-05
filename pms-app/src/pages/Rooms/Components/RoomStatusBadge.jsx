import "./RoomStatusBadge.css";

const RoomStatusBadge = ({ status }) => {

    const getClass = () => {

        switch (status) {

            case "Available":
                return "available";

            case "Occupied":
                return "occupied";

            case "Needs Cleaning":
                return "cleaning";

            default:
                return "";
        }

    };

    return (
        <span className={`room-status ${getClass()}`}>
            {status}
        </span>
    );

};

export default RoomStatusBadge;