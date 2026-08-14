import {
    MdClose,
    MdHotel,
    MdLayers,
    MdPeople,
    MdMeetingRoom,
    MdCurrencyRupee,
    MdInfoOutline,
    MdDescription
} from "react-icons/md";

import RoomStatusBadge from "./RoomStatusBadge";

import "./RoomDetailsPanel.css";


const RoomDetailsPanel = ({
    room,
    onClose
}) => {

    if (!room) {
        return null;
    }


    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };


    return (

        <div className="room-details-overlay">

            <div className="room-details-panel">


                {/* ================= HEADER ================= */}

                <div className="room-panel-header">

                    <div>

                        <div className="room-panel-title">

                            <div className="room-panel-icon">

                                <MdMeetingRoom size={22} />

                            </div>

                            <div>

                                <h2>
                                    Room {room.roomNumber}
                                </h2>

                                <p>
                                    {room.roomType} Room
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        className="room-panel-close"
                        onClick={onClose}
                        aria-label="Close"
                    >

                        <MdClose size={22} />

                    </button>

                </div>


                {/* ================= STATUS ================= */}

                <div className="room-panel-status-row">

                    <span className="room-panel-label">
                        Current Status
                    </span>

                    <RoomStatusBadge
                        status={room.status}
                    />

                </div>


                {/* ================= ROOM INFORMATION ================= */}

                <div className="room-panel-section">

                    <div className="room-panel-section-title">

                        <MdInfoOutline />

                        <span>
                            Room Information
                        </span>

                    </div>


                    <div className="room-detail-grid">


                        {/* Hotel */}

                        <div className="room-detail-item">

                            <div className="room-detail-icon blue">

                                <MdHotel />

                            </div>

                            <div>

                                <span>
                                    Hotel
                                </span>

                                <strong>
                                    {room.hotelName || "—"}
                                </strong>

                            </div>

                        </div>


                        {/* Floor */}

                        <div className="room-detail-item">

                            <div className="room-detail-icon purple">

                                <MdLayers />

                            </div>

                            <div>

                                <span>
                                    Floor
                                </span>

                                <strong>
                                    {room.floor || "—"}
                                </strong>

                            </div>

                        </div>


                        {/* Room Type */}

                        <div className="room-detail-item">

                            <div className="room-detail-icon orange">

                                <MdMeetingRoom />

                            </div>

                            <div>

                                <span>
                                    Room Type
                                </span>

                                <strong>
                                    {room.roomType || "—"}
                                </strong>

                            </div>

                        </div>


                        {/* Capacity */}

                        <div className="room-detail-item">

                            <div className="room-detail-icon green">

                                <MdPeople />

                            </div>

                            <div>

                                <span>
                                    Capacity
                                </span>

                                <strong>
                                    {room.capacity} Guests
                                </strong>

                            </div>

                        </div>


                        {/* Price */}

                        <div className="room-detail-item">

                            <div className="room-detail-icon blue">

                                <MdCurrencyRupee />

                            </div>

                            <div>

                                <span>
                                    Price / Night
                                </span>

                                <strong className="detail-price">
                                    ₹{Number(room.price).toFixed(2)}
                                </strong>

                            </div>

                        </div>


                        {/* Status */}

                        <div className="room-detail-item">

                            <div className="room-detail-icon green">

                                <MdInfoOutline />

                            </div>

                            <div>

                                <span>
                                    Status
                                </span>

                                <RoomStatusBadge
                                    status={room.status}
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= NOTES ================= */}

                <div className="room-panel-section">

                    <div className="room-panel-section-title">

                        <MdDescription />

                        <span>
                            Notes
                        </span>

                    </div>


                    <div className="room-notes-box">

                        {room.notes ? (

                            <p>
                                {room.notes}
                            </p>

                        ) : (

                            <p className="no-notes">
                                No notes provided.
                            </p>

                        )}

                    </div>

                </div>


                {/* ================= SYSTEM INFORMATION ================= */}

                <div className="room-system-card">

                    <div className="room-system-title">

                        <MdInfoOutline />

                        <span>
                            Room Information
                        </span>

                    </div>


                    <div className="room-system-grid">

                        <div>

                            <span>
                                Room ID
                            </span>

                            <strong>
                                {room.id}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Created At
                            </span>

                            <strong>
                                {formatDate(room.createdAt)}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Last Updated
                            </span>

                            <strong>
                                {formatDate(room.updatedAt)}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* ================= FOOTER ================= */}

                <div className="room-panel-footer">

                    <button
                        className="room-panel-close-btn"
                        onClick={onClose}
                    >

                        Close

                    </button>

                </div>


            </div>

        </div>
    );
};

export default RoomDetailsPanel;