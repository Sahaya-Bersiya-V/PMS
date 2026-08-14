import {
    MdClose,
    MdHotel,
    MdPeople,
    MdMeetingRoom,
    MdCurrencyRupee,
    MdInfoOutline,
    MdDescription,
    MdApartment
} from "react-icons/md";

import RoomTypeStatusBadge from "./RoomTypeStatusBadge";

import "./RoomTypeDetailsPanel.css";


const RoomTypeDetailsPanel = ({
    roomType,
    onClose
}) => {

    if (!roomType) {
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

        <div className="roomtype-details-overlay">

            <div className="roomtype-details-panel">


                {/* HEADER */}

                <div className="roomtype-panel-header">

                    <div className="roomtype-panel-title">

                        <div className="roomtype-panel-icon">

                            <MdMeetingRoom size={23} />

                        </div>


                        <div>

                            <h2>
                                {roomType.name}
                            </h2>

                            <p>
                                Room Type Details
                            </p>

                        </div>

                    </div>


                    <button
                        className="roomtype-panel-close"
                        onClick={onClose}
                    >

                        <MdClose size={22} />

                    </button>

                </div>


                {/* STATUS */}

                <div className="roomtype-panel-status">

                    <span>
                        Current Status
                    </span>

                    <RoomTypeStatusBadge
                        status={roomType.status}
                    />

                </div>


                {/* BASIC INFORMATION */}

                <div className="roomtype-panel-section">

                    <div className="roomtype-section-title">

                        <MdInfoOutline />

                        Room Type Information

                    </div>


                    <div className="roomtype-detail-grid">


                        {/* Hotel */}

                        <div className="roomtype-detail-item">

                            <div className="detail-icon blue">

                                <MdHotel />

                            </div>

                            <div>

                                <span>
                                    Hotel
                                </span>

                                <strong>
                                    {roomType.hotelName || "—"}
                                </strong>

                            </div>

                        </div>


                        {/* Room Type */}

                        <div className="roomtype-detail-item">

                            <div className="detail-icon purple">

                                <MdMeetingRoom />

                            </div>

                            <div>

                                <span>
                                    Room Type
                                </span>

                                <strong>
                                    {roomType.name}
                                </strong>

                            </div>

                        </div>


                        {/* Capacity */}

                        <div className="roomtype-detail-item">

                            <div className="detail-icon green">

                                <MdPeople />

                            </div>

                            <div>

                                <span>
                                    Maximum Occupancy
                                </span>

                                <strong>
                                    {roomType.capacity} Guests
                                </strong>

                            </div>

                        </div>


                        {/* Base Price */}

                        <div className="roomtype-detail-item">

                            <div className="detail-icon orange">

                                <MdCurrencyRupee />

                            </div>

                            <div>

                                <span>
                                    Base Price
                                </span>

                                <strong className="roomtype-detail-price">

                                    ₹{Number(
                                        roomType.basePrice
                                    ).toFixed(2)}

                                </strong>

                            </div>

                        </div>


                        {/* Total Rooms */}

                        <div className="roomtype-detail-item">

                            <div className="detail-icon blue">

                                <MdApartment />

                            </div>

                            <div>

                                <span>
                                    Total Rooms
                                </span>

                                <strong>
                                    {roomType.totalRooms}
                                </strong>

                            </div>

                        </div>


                        {/* Status */}

                        <div className="roomtype-detail-item">

                            <div className="detail-icon green">

                                <MdInfoOutline />

                            </div>

                            <div>

                                <span>
                                    Status
                                </span>

                                <RoomTypeStatusBadge
                                    status={roomType.status}
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* AMENITIES */}

                <div className="roomtype-panel-section">

                    <div className="roomtype-section-title">

                        <MdInfoOutline />

                        Amenities

                    </div>


                    <div className="roomtype-text-box">

                        {roomType.amenities ? (

                            <p>
                                {roomType.amenities}
                            </p>

                        ) : (

                            <p className="empty-detail">
                                No amenities added.
                            </p>

                        )}

                    </div>

                </div>


                {/* DESCRIPTION */}

                <div className="roomtype-panel-section">

                    <div className="roomtype-section-title">

                        <MdDescription />

                        Description

                    </div>


                    <div className="roomtype-text-box">

                        {roomType.description ? (

                            <p>
                                {roomType.description}
                            </p>

                        ) : (

                            <p className="empty-detail">
                                No description added.
                            </p>

                        )}

                    </div>

                </div>


                {/* SYSTEM INFO */}

                <div className="roomtype-system-card">

                    <div className="roomtype-system-title">

                        <MdInfoOutline />

                        System Information

                    </div>


                    <div className="roomtype-system-grid">

                        <div>

                            <span>
                                Room Type ID
                            </span>

                            <strong>
                                {roomType.id}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Created At
                            </span>

                            <strong>
                                {formatDate(
                                    roomType.createdAt
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Last Updated
                            </span>

                            <strong>
                                {formatDate(
                                    roomType.updatedAt
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* FOOTER */}

                <div className="roomtype-panel-footer">

                    <button
                        onClick={onClose}
                        className="roomtype-close-btn"
                    >

                        Close

                    </button>

                </div>


            </div>

        </div>

    );

};

export default RoomTypeDetailsPanel;