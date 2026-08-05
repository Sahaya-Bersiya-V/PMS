import "./RoomTile.css";

const colors = {
  Available: "#22c55e",
  Occupied: "#ef4444",
  "Needs Cleaning": "#f59e0b",
};

const RoomTile = ({ room }) => {
  return (
    <div
      className="room-tile"
      style={{
        borderLeft: `6px solid ${colors[room.status]}`,
      }}
    >
      <h3>Room {room.roomNo}</h3>

      <span
        className="status"
        style={{ color: colors[room.status] }}
      >
        {room.status}
      </span>
    </div>
  );
};

export default RoomTile;