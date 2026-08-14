import "./RoomStatusBadge.css";

const RoomStatusBadge = ({ status }) => {

    const normalizedStatus = String(status || "")
        .toLowerCase()
        .replace(/\s+/g, "_");

    const statusConfig = {

        available: {
            label: "Available",
            className: "available",
        },

        occupied: {
            label: "Occupied",
            className: "occupied",
        },

        reserved: {
            label: "Reserved",
            className: "reserved",
        },

        cleaning: {
            label: "Needs Cleaning",
            className: "cleaning",
        },

        needs_cleaning: {
            label: "Needs Cleaning",
            className: "cleaning",
        },

        maintenance: {
            label: "Maintenance",
            className: "maintenance",
        },

    };

    const current =
        statusConfig[normalizedStatus] || {
            label: status || "Unknown",
            className: "unknown",
        };

    return (
        <span className={`room-status ${current.className}`}>
            <span className="status-dot"></span>
            {current.label}
        </span>
    );
};

export default RoomStatusBadge;