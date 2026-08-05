import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";

import "./RoomTypeTable.css";
import RoomTypeStatusBadge from "./RoomTypeStatusBadge";

const RoomTypeTable = ({ roomTypes }) => {

    return (

        <div className="roomtype-table-container">

            <table className="roomtype-table">

                <thead>

                    <tr>

                        <th>Room Type</th>

                        <th>Base Price</th>

                        <th>Capacity</th>

                        <th>Bed Type</th>

                        {/* <th>Room Size</th> */}

                        <th>Total Rooms</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {roomTypes.map((type) => (

                        <tr key={type.id}>

                            <td>{type.name}</td>

                            <td>₹{type.basePrice}</td>

                            <td>{type.capacity} Guests</td>

                            <td>{type.bedType}</td>

                            {/* <td>{type.roomSize}</td> */}

                            <td>{type.totalRooms}</td>

                            <td>
                                <RoomTypeStatusBadge
                                    status={type.status}
                                />
                            </td>

                            <td>

                                <div className="type-actions">

                                    <button className="view-btn">
                                        <MdVisibility />
                                    </button>

                                    <button className="edit-btn">
                                        {/* <MdEdit /> */}
                                        ✏️
                                    </button>

                                    <button className="delete-btn">
                                        <MdDelete />
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

export default RoomTypeTable;