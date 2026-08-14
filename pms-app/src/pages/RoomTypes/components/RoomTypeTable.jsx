import {
    MdVisibility
} from "react-icons/md";

import "./RoomTypeTable.css";

import RoomTypeStatusBadge from "./RoomTypeStatusBadge";


const RoomTypeTable = ({
    roomTypes,
    onView
}) => {

    return (

        <div className="roomtype-table-container">

            <table className="roomtype-table">

                <thead>

                    <tr>

                        <th>Room Type</th>

                        <th>Base Price</th>

                        <th>Capacity</th>

                        <th>Total Rooms</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>

                    {roomTypes.length > 0 ? (

                        roomTypes.map((type) => (

                            <tr key={type.id}>

                                <td>

                                    <strong className="roomtype-name">
                                        {type.name}
                                    </strong>

                                </td>


                                <td>

                                    <strong className="roomtype-price">
                                        ₹{Number(type.basePrice).toFixed(2)}
                                    </strong>

                                </td>


                                <td>

                                    {type.capacity} Guests

                                </td>


                                <td>

                                    {type.totalRooms}

                                </td>


                                <td>

                                    <RoomTypeStatusBadge
                                        status={type.status}
                                    />

                                </td>


                                <td>

                                    <div className="type-actions">

                                        <button
                                            type="button"
                                            className="type-view-btn"
                                            title="View Room Type"
                                            onClick={() =>
                                                onView(type)
                                            }
                                        >

                                            <MdVisibility
                                                size={19}
                                            />

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td
                                colSpan="6"
                                className="empty-roomtype-row"
                            >

                                No room types found.

                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>

    );

};

export default RoomTypeTable;