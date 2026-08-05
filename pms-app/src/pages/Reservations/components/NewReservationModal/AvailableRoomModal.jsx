import "./AvailableRoomModal.css";

const AvailableRoomModal = ({
  isOpen,
  rooms,
  onSelect,
  onClose,
}) => {

  if (!isOpen) return null;

  return (
    <div className="room-overlay">

      <div className="room-modal">

        <div className="room-modal-header">

          <h2>Select Available Room</h2>

          <button onClick={onClose}>✕</button>

        </div>

       <div className="available-room-grid">

    {rooms.length === 0 ? (

        <p className="no-room-message">
            No available rooms for the selected room type.
        </p>

    ) : (

        rooms.map((room) => (

            <div
                key={room.id}
                className="available-room-card"
                onClick={() => onSelect(room)}
            >
                <h3>Room {room.roomNo}</h3>

                <p>{room.roomType}</p>

                <span className="status">
                    🟢 Available
                </span>

                <h4>₹{room.price}</h4>

            </div>

        ))

    )}

</div>

      </div>

    </div>
  );
};

export default AvailableRoomModal;