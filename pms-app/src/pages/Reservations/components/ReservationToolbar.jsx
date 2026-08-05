
import { useState } from "react";
import {
    FaPlus,
    FaSearch,
    FaCalendarAlt,
} from "react-icons/fa";

import "./ReservationToolbar.css";

const ReservationToolbar = ({ onNewReservation }) => {

    const [dateFilter, setDateFilter] = useState("");

    return (

        <div className="reservation-toolbar">

            <div className="toolbar-left">

                <div className="search-box">

                    <FaSearch className="search-icon" />

                    <input
                        type="text"
                        placeholder="Search reservations..."
                    />

                </div>

                <select>

                    <option>Status</option>

                    <option>Confirmed</option>

                    <option>Checked In</option>

                    <option>Checked Out</option>

                    <option>Cancelled</option>

                </select>

                <select>

                    <option>Room Type</option>

                    <option>Standard</option>

                    <option>Deluxe</option>

                    <option>Family</option>

                </select>

                <select
                    value={dateFilter}
                    onChange={(e) =>
                        setDateFilter(e.target.value)
                    }
                >

                    <option value="">
                        Filter Date
                    </option>

                    <option value="today">
                        Today
                    </option>

                    <option value="yesterday">
                        Yesterday
                    </option>

                    <option value="week">
                        This Week
                    </option>

                    <option value="month">
                        This Month
                    </option>

                    <option value="custom">
                        Custom Date
                    </option>

                </select>

                {dateFilter === "custom" && (

                    <div className="date-filter">

                        <FaCalendarAlt className="date-icon" />

                        <input
                            type="date"
                            className="date-input"
                        />

                    </div>

                )}

            </div>

            <button
                className="add-btn"
                onClick={onNewReservation}
            >

                <FaPlus />

                New Reservation

            </button>

            

        </div>

    );

};

export default ReservationToolbar;