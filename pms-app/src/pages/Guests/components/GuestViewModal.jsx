import {
    FaTimes,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaIdCard,
    FaMapMarkerAlt,
    FaBuilding,
    FaCalendarAlt
} from "react-icons/fa";

import "./GuestViewModal.css";

const GuestViewModal = ({
    isOpen,
    onClose,
    guest
}) => {

    if (!isOpen || !guest) {
        return null;
    }

    const fullName =
        guest.guest_name ||
        `${guest.first_name || ""} ${
            guest.last_name || ""
        }`.trim();


    return (

        <div
            className="guest-view-overlay"
            onClick={onClose}
        >

            <div
                className="guest-view-panel"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* HEADER */}

                <div className="guest-view-header">

                    <div className="guest-view-title">

                        <div className={`guest-view-icon ${String(guest.gender || "").toLowerCase()}`}>
                            {String(guest.gender || "").toLowerCase() === "female" ? "♀" :
                                String(guest.gender || "").toLowerCase() === "male" ? "♂" : <FaUser />}
                        </div>

                        <div>

                            <h2>
                                {fullName}
                            </h2>

                            <p>
                                Guest Details
                            </p>

                        </div>

                    </div>


                    <button
                        className="guest-close-btn"
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>

                </div>


                {/* STATUS */}

                <div className="guest-status-row">

                    <span>
                        Current Status
                    </span>

                    <span
                        className={`guest-detail-status ${guest.stayStatus || guest.status || "inactive"}`}
                    >
                        {guest.stayStatus === "in_house" ? "In House" :
                            guest.stayStatus === "checking_out" ? "Checking Out" :
                                guest.stayStatus === "upcoming" ? "Upcoming" :
                                    guest.stayStatus === "checked_out" ? "Checked Out" :
                                        guest.stayStatus === "cancelled" ? "Cancelled" :
                                            guest.stayStatus === "no_show" ? "No Show" :
                                                guest.status === "active" ? "Active" : "Inactive"}
                    </span>

                </div>


                {/* PERSONAL INFORMATION */}

                <div className="guest-view-section">

                    <h3>
                        <FaUser />
                        Personal Information
                    </h3>

                    <div className="guest-info-grid">

                        <InfoItem
                            icon={<FaUser />}
                            label="Guest ID"
                            value={
                                guest.guest_id
                            }
                        />

                        <InfoItem
                            icon={<FaPhone />}
                            label="Phone"
                            value={
                                guest.phone
                            }
                        />

                        <InfoItem
                            icon={<FaEnvelope />}
                            label="Email"
                            value={
                                guest.email || "-"
                            }
                        />

                        {/* <InfoItem
                            icon={<FaCalendarAlt />}
                            label="Date of Birth"
                            value={
                                guest.date_of_birth ||
                                "-"
                            }
                        /> */}

                    </div>

                </div>


                {/* IDENTITY */}

                <div className="guest-view-section">

                    <h3>
                        <FaIdCard />
                        Identity Information
                    </h3>

                    <div className="guest-info-grid">

                        <InfoItem
                            icon={<FaIdCard />}
                            label="Identity Type"
                            value={
                                guest.identity_type ||
                                "-"
                            }
                        />

                        <InfoItem
                            icon={<FaIdCard />}
                            label="Identity Number"
                            value={
                                guest.identity_number ||
                                "-"
                            }
                        />

                    </div>

                </div>


                {/* ADDRESS */}

                <div className="guest-view-section">

                    <h3>
                        <FaMapMarkerAlt />
                        Address
                    </h3>

                    <div className="guest-address-box">

                        {guest.address || "-"}

                    </div>

                    {/* <div className="guest-info-grid">

                        <InfoItem
                            label="City"
                            value={
                                guest.city || "-"
                            }
                        />

                        <InfoItem
                            label="Pincode"
                            value={
                                guest.pincode || "-"
                            }
                        />

                    </div> */}

                </div>


                {/* OTHER DETAILS */}

                {/* <div className="guest-view-section">

                    <h3>
                        <FaBuilding />
                        Other Details
                    </h3>

                    <div className="guest-info-grid">

                        <InfoItem
                            label="Company"
                            value={
                                guest.company_name ||
                                "-"
                            }
                        />

                        <InfoItem
                            label="GST Number"
                            value={
                                guest.gst_number ||
                                "-"
                            }
                        />

                        <InfoItem
                            label="Membership"
                            value={
                                guest.membership ||
                                "-"
                            }
                        />

                        <InfoItem
                            label="Total Visits"
                            value={
                                guest.visits ?? 0
                            }
                        />

                    </div>

                </div> */}

            </div>

        </div>
    );
};


const InfoItem = ({
    icon,
    label,
    value
}) => {

    return (

        <div className="guest-info-item">

            {icon && (
                <div className="guest-info-icon">
                    {icon}
                </div>
            )}

            <div>

                <span>
                    {label}
                </span>

                <strong>
                    {value}
                </strong>

            </div>

        </div>

    );

};

export default GuestViewModal;