import {
    MdVisibility
} from "react-icons/md";

import "./RoomTable.css";

import RoomStatusBadge from "./RoomStatusBadge";


const RoomTable = ({
    rooms,
    onView
}) => {

    return (

        <div className="room-table-container">

            <table className="room-table">

                <thead>

                    <tr>

                        <th>Room No</th>

                        <th>Room Type</th>

                        <th>Floor</th>

                        <th>Capacity</th>

                        <th>Price / Night</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>

                    {rooms.length > 0 ? (

                        rooms.map((room) => (

                            <tr key={room.id}>

                                <td>
                                    <strong className="room-number">
                                        {room.roomNumber}
                                    </strong>
                                </td>


                                <td>
                                    {room.roomType}
                                </td>


                                <td>
                                    {room.floor}
                                </td>


                                <td>
                                    {room.capacity} Guests
                                </td>


                                <td>
                                    <strong className="room-price">
                                        ₹{Number(room.price).toFixed(2)}
                                    </strong>
                                </td>


                                <td>

    <RoomStatusBadge
        status={room.status}
    />

    {room.status === "cleaning" &&
        room.cleaningUntil && (

            <div className="cleaning-until">

                Until{" "}

                {new Date(
                    room.cleaningUntil
                ).toLocaleTimeString(
                    "en-IN",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )}

            </div>

        )}

</td>


                                <td>

                                    <div className="room-actions">

                                        <button
                                            type="button"
                                            className="room-action-btn view"
                                            title="View Room"
                                            onClick={() =>
                                                onView(room)
                                            }
                                        >

                                            <MdVisibility size={19} />

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td
                                colSpan="7"
                                className="empty-room-row"
                            >

                                <div className="empty-room">

                                    <MdVisibility size={28} />

                                    <strong>
                                        No rooms found
                                    </strong>

                                    <span>
                                        Try changing your search or filters.
                                    </span>

                                </div>

                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>
    );
};

export default RoomTable;