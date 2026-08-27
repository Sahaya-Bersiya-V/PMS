import {
    MdVisibility
} from "react-icons/md";

import "./GuestTable.css";

const GuestTable = ({
    guests,
    loading,
    onViewGuest
}) => {

    return (

        <div className="guest-table-container">

            <table className="guest-table">

                <thead>

                    <tr>

                        <th>Guest Name</th>

                        <th>Stay Status</th>

                        <th>Phone</th>

                        <th>Email</th>

                        {/* <th>City</th> */}

                        <th>Identity Type</th>

                        <th>Visits</th>

                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>

                    {loading ? (

                        <tr>

                            <td
                                colSpan="7"
                                className="table-message"
                            >
                                Loading guests...
                            </td>

                        </tr>

                    ) : guests.length === 0 ? (

                        <tr>

                            <td
                                colSpan="7"
                                className="table-message"
                            >
                                No guests found.
                            </td>

                        </tr>

                    ) : (

                        guests.map((guest) => (

                            <tr key={guest.id}>

                                <td>
                                    <div className="guest-name-cell">
                                        <span className={`guest-avatar ${String(guest.gender || "").toLowerCase()}`}>
                                            {String(guest.gender || "").toLowerCase() === "female" ? "♀" :
                                                String(guest.gender || "").toLowerCase() === "male" ? "♂" : "G"}
                                        </span>
                                        <strong>{guest.guest_name}</strong>
                                    </div>
                                </td>

                                <td>
                                    <span className={`guest-stay-status ${guest.stayStatus}`}>
                                        {guest.stayStatus === "in_house" ? "In House" :
                                            guest.stayStatus === "checking_out" ? "Checking Out" :
                                                guest.stayStatus === "upcoming" ? "Upcoming" :
                                                    guest.stayStatus === "checked_out" ? "Checked Out" :
                                                        guest.stayStatus === "cancelled" ? "Cancelled" :
                                                            guest.stayStatus === "no_show" ? "No Show" : "No Reservation"}
                                    </span>
                                </td>

                                <td>
                                    {guest.phone || "-"}
                                </td>

                                <td>
                                    {guest.email || "-"}
                                </td>

                                {/* <td>
                                    {guest.city || "-"}
                                </td> */}

                                <td>
                                    {guest.identity_type
                                        ? formatIdentityType(
                                            guest.identity_type
                                        )
                                        : "-"
                                    }
                                </td>

                                <td>
                                    {guest.visits ?? 0}
                                </td>

                                <td>

                                    <div className="guest-actions">

                                        <button
                                            className="view-btn"
                                            onClick={() =>
                                                onViewGuest(
                                                    guest
                                                )
                                            }
                                            title="View Guest"
                                        >

                                            <MdVisibility />

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

};


const formatIdentityType = (type) => {

    const labels = {

        aadhaar: "Aadhaar",

        passport: "Passport",

        driving_license:
            "Driving License",

        voter_id:
            "Voter ID",

        other:
            "Other"

    };

    return labels[type] || type;

};


export default GuestTable;