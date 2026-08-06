import { MdVisibility , MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import "./GuestTable.css";

import GuestStatusBadge from "./GuestStatusBadge";

const GuestTable = ({ guests,onEditGuest }) => {

    return (

        <div className="guest-table-container">

            <table className="guest-table">

                <thead>

                    <tr>

                        <th>Guest Name</th>

                        <th>Phone</th>

                        <th>Email</th>

                        <th>City</th>

                        <th>Membership</th>

                        <th>Visits</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {guests.map((guest) => (

                        <tr key={guest.id}>

                            <td>{guest.guestName}</td>

                            <td>{guest.phone}</td>

                            <td>{guest.email}</td>

                            <td>{guest.city}</td>

                            <td>{guest.membership}</td>

                            <td>{guest.visits}</td>

                            <td>

                                <GuestStatusBadge
                                    status={guest.status}
                                />

                            </td>

                            <td>

                                <div className="guest-actions">

                                    <button className="view-btn">
                                        <MdVisibility />
                                    </button>

                                    <button
    className="edit-btn"
    onClick={() => onEditGuest(guest)}
>

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

export default GuestTable;