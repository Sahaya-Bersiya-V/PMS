import {
    MdVisibility,
    MdEdit,
    MdDelete
} from "react-icons/md";
import "./RoomTable.css";

import RoomStatusBadge from "./RoomStatusBadge";

const RoomTable = ({ rooms }) => {

    return (

        <div className="room-table-container">

            <table className="room-table">

                <thead>

                    <tr>

                        <th>Room No</th>

                        <th>Room Type</th>

                        <th>Floor</th>

                        <th>Capacity</th>

                        <th>Price</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {rooms.map((room) => (

                        <tr key={room.id}>

                            <td>{room.roomNumber}</td>

                            <td>{room.roomType}</td>

                            <td>{room.floor}</td>

                            <td>{room.capacity} Guests</td>

                            <td>₹{room.price}</td>

                            <td>

                                <RoomStatusBadge
                                    status={room.status}
                                />

                            </td>

                            <td>

                                <div className="room-actions">

    <button className="view-btn">
        <MdVisibility size={18} />
    </button>

    <button className="edit-btn">
        {/* <MdEdit size={18} /> */}
        ✏️
    </button>

    <button className="delete-btn">
        <MdDelete size={18} />
    </button>

</div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

};

export default RoomTable;