import { FaTrash } from "react-icons/fa";

import "./RoomCard.css";
import { useState } from "react";

import { rooms } from "../../../../data/rooms";
import AvailableRoomModal from "./AvailableRoomModal";
const RoomCard = ({
    room,
    index,
    onRemove,
    updateRoom,
}) => {
const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
const [availableRooms, setAvailableRooms] = useState([]);





const handleRoomType = (e) => {
    const type = e.target.value;

    updateRoom(index, "roomType", type);
    updateRoom(index, "roomNumber", "");
    updateRoom(index, "price", 0);

    const filtered = rooms.filter(
        (room) =>
            room.roomType === type &&
            room.status === "Available"
    );

    setAvailableRooms(filtered);
};

const subtotal = room.price - room.discount;

const taxAmount = (subtotal * room.tax) / 100;

const total = subtotal + taxAmount;


const handleRoomSelect = (selectedRoom) => {

    updateRoom(index, "roomNumber", selectedRoom.roomNo);
    updateRoom(index, "price", selectedRoom.price);

    setIsRoomModalOpen(false);

};
    return (

        <div className="room-card">

            <div className="room-card-header">

                <h4>Room {index + 1}</h4>

                {index !== 0 && (

                    <button
                        className="remove-room-btn"
                        onClick={onRemove}
                    >
                        <FaTrash />
                        Remove
                    </button>

                )}

            </div>

            <div className="form-grid">

                <div className="form-group">
                    <label>Room Type</label>

                    <select
    value={room.roomType}
    onChange={handleRoomType}
>

    <option value="">
        Select Room Type
    </option>

    <option value="Standard">
        Standard
    </option>

    <option value="Deluxe">
        Deluxe
    </option>

    <option value="Family">
        Family
    </option>

</select>
                </div>

                <div className="form-group">
                    <label>Room Number</label>

                    {/* <select
    value={selectedRoom}
    onChange={handleRoomNumber}
>

    <option value="">
        Select Room
    </option>

    {availableRooms.map(room => (

        <option
            key={room.id}
            value={room.roomNo}
        >
            {room.roomNo}
        </option>

    ))}

</select> */}
<div className="room-selector">

    <input
        value={room.roomNumber}
        readOnly
        placeholder="Choose Room"
    />

    <button
    type="button"
    className="browse-room-btn"
    onClick={() => setIsRoomModalOpen(true)}
>
    Browse Rooms
</button>

</div>
                </div>

                <div className="form-group">
                    <label>Adults</label>

                   <input
    type="number"
    value={room.adults}
    onChange={(e) =>
        updateRoom(index, "adults", Number(e.target.value))
    }
/>
                </div>

                <div className="form-group">
                    <label>Children</label>

<input
    type="number"
    value={room.children}
    onChange={(e) =>
        updateRoom(index, "children", Number(e.target.value))
    }
/>                </div>

                <div className="form-group">
                    <label>Price</label>

                    <input
    type="number"
    value={room.price}
    readOnly
/>
                </div>

                <div className="form-group">
                    <label>Discount</label>

                    <input
    type="number"
    value={room.discount}
    onChange={(e)=>updateRoom(
    index,
    "discount",
    Number(e.target.value)
)}
/>
                </div>

                <div className="form-group">
                    <label>Tax (%)</label>

                    <input
    type="number"
    value={room.tax}
    onChange={(e)=>updateRoom(
    index,
    "tax",
    Number(e.target.value)
)}
/>
                </div>

                <div className="form-group">
                    <label>Total</label>

                  <input
    type="text"
    value={`₹${total}`}
    readOnly
/>
                </div>

            </div>
            <AvailableRoomModal
    isOpen={isRoomModalOpen}
    rooms={availableRooms}
    onSelect={handleRoomSelect}
    onClose={() => setIsRoomModalOpen(false)}
/>

        </div>

    );

};

export default RoomCard;