import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import "../styles/FrontDeskDashboard.css";


const RESERVATION_API =
    "http://127.0.0.1:8000/api/reservations/";

const ROOM_API =
    "http://127.0.0.1:8000/api/rooms/";


const FrontDeskDashboard = () => {

    const [rooms, setRooms] = useState([]);

    const [reservations, setReservations] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [roomFilter, setRoomFilter] =
        useState("All");


    const [showAllCheckIns, setShowAllCheckIns] =
        useState(false);

    const [showAllCheckOuts, setShowAllCheckOuts] =
        useState(false);

    const [showAllRooms, setShowAllRooms] =
        useState(false);


    const [selectedFloor, setSelectedFloor] =
        useState(null);


    const [currentDateTime, setCurrentDateTime] =
        useState(new Date());


    /*
    ============================================================
    DATE / TIME
    ============================================================
    */

    useEffect(() => {

        const timer = setInterval(() => {

            setCurrentDateTime(
                new Date()
            );

        }, 1000);


        return () => {
            clearInterval(timer);
        };

    }, []);


    /*
    ============================================================
    FETCH ROOMS
    ============================================================
    */

    const fetchRooms = async () => {

        try {

            const response =
                await fetch(ROOM_API);

            if (!response.ok) {

                throw new Error(
                    "Unable to load rooms."
                );

            }

            const data =
                await response.json();

            const roomData =
                Array.isArray(data)
                    ? data
                    : data.results || [];


            const formatted =
                roomData.map((room) => ({

                    id: room.id,

                    number:
                        room.room_number,

                    type:
                        room.room_type_name,

                    floor:
                        room.floor,

                    status:
                        room.status,

                    cleaningUntil:
                        room.cleaning_until,

                    capacity:
                        room.capacity,

                    price:
                        room.price,

                }));


            setRooms(formatted);


        } catch (err) {

            console.error(
                "Room fetch error:",
                err
            );

            setError(
                "Unable to load room information."
            );

        }

    };


    /*
    ============================================================
    FETCH RESERVATIONS
    ============================================================
    */

    const fetchReservations = async () => {

        try {

            const response =
                await fetch(
                    RESERVATION_API
                );

            if (!response.ok) {

                throw new Error(
                    "Unable to load reservations."
                );

            }


            const data =
                await response.json();


            const reservationData =
                Array.isArray(data)
                    ? data
                    : data.results || [];


            setReservations(
                reservationData
            );


        } catch (err) {

            console.error(
                "Reservation fetch error:",
                err
            );

            setError(
                "Unable to load reservation information."
            );

        }

    };


    /*
    ============================================================
    LOAD DASHBOARD
    ============================================================
    */

    useEffect(() => {

        const loadDashboard =
            async () => {

                setLoading(true);

                setError("");

                await Promise.all([
                    fetchRooms(),
                    fetchReservations()
                ]);

                setLoading(false);

            };


        loadDashboard();


        /*
        Refresh every 30 seconds.
        */

        const interval =
            setInterval(() => {

                fetchRooms();
                fetchReservations();

            }, 30000);


        return () => {

            clearInterval(interval);

        };

    }, []);


    /*
    ============================================================
    TODAY
    ============================================================
    */

    const today = useMemo(() => {

        const date =
            new Date();

        date.setHours(
            0,
            0,
            0,
            0
        );

        return date;

    }, [currentDateTime]);


    const isToday = (dateValue) => {

        if (!dateValue) {
            return false;
        }

        const date =
            new Date(dateValue);

        return (
            date.getFullYear() ===
                today.getFullYear() &&

            date.getMonth() ===
                today.getMonth() &&

            date.getDate() ===
                today.getDate()
        );

    };


    /*
    ============================================================
    STATUS HELPERS
    ============================================================
    */

    const normalizeStatus = (status) => {

        return String(status || "")
            .toLowerCase()
            .replace(/\s+/g, "_");

    };


    /*
    ============================================================
    TODAY'S CHECK-INS
    ============================================================
    */

    const todaysCheckIns =
        useMemo(() => {

            return reservations.filter(
                (reservation) => {

                    return (
                        isToday(
                            reservation.check_in
                        ) &&

                        ![
                            "cancelled",
                            "no_show"
                        ].includes(
                            normalizeStatus(
                                reservation.status
                            )
                        )
                    );

                }
            );

        }, [
            reservations,
            today
        ]);


    /*
    ============================================================
    TODAY'S CHECK-OUTS
    ============================================================
    
    IMPORTANT:
    
    We use the reservation CHECK-OUT DATE,
    not a hardcoded list.

    Already checked-out reservations
    are excluded.

    Therefore if a guest was supposed
    to leave today but already checked
    out early, they disappear from
    Pending Check-Outs.
    ============================================================
    */

    const todaysCheckOuts =
        useMemo(() => {

            return reservations.filter(
                (reservation) => {

                    const reservationStatus =
                        normalizeStatus(
                            reservation.status
                        );


                    const isCompleted =
                        [
                            "checked_out",
                            "cancelled",
                            "no_show"
                        ].includes(
                            reservationStatus
                        );


                    return (
                        isToday(
                            reservation.check_out
                        ) &&
                        !isCompleted
                    );

                }
            );

        }, [
            reservations,
            today
        ]);


    /*
    ============================================================
    AVAILABLE ROOMS
    ============================================================
    */

    const availableRooms =
        rooms.filter(
            (room) =>
                normalizeStatus(
                    room.status
                ) === "available"
        ).length;


    /*
    ============================================================
    OCCUPIED ROOMS
    ============================================================
    */

    const occupiedRooms =
        rooms.filter(
            (room) =>
                normalizeStatus(
                    room.status
                ) === "occupied"
        ).length;


    /*
    ============================================================
    ROOM FILTER
    ============================================================
    */

    const filteredRooms =
        useMemo(() => {

            if (
                roomFilter ===
                "All"
            ) {

                return rooms;

            }


            return rooms.filter(
                (room) =>
                    normalizeStatus(
                        room.status
                    ) ===
                    normalizeStatus(
                        roomFilter
                    )
            );

        }, [
            rooms,
            roomFilter
        ]);


    /*
    ============================================================
    FLOORS
    ============================================================
    */

    const floors =
        useMemo(() => {

            return [
                ...new Set(
                    rooms.map(
                        (room) =>
                            room.floor
                    )
                )
            ].sort(
                (a, b) =>
                    a - b
            );

        }, [rooms]);


    /*
    ============================================================
    SELECT FIRST FLOOR
    ============================================================
    */

    useEffect(() => {

        if (
            floors.length > 0 &&
            selectedFloor === null
        ) {

            setSelectedFloor(
                floors[0]
            );

        }

    }, [
        floors,
        selectedFloor
    ]);


    /*
    ============================================================
    FLOOR ROOMS
    ============================================================
    */

    const floorRooms =
        rooms.filter(
            (room) =>
                room.floor ===
                selectedFloor
        );


    /*
    ============================================================
    CHECK-OUT
    ============================================================
    */

    const handleCheckOut =
        async (reservationId) => {

            try {

                const response =
                    await fetch(
                        `${RESERVATION_API}${reservationId}/check-out/`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Checkout failed."
                    );

                }


                /*
                Refresh database data
                */

                await Promise.all([
                    fetchRooms(),
                    fetchReservations()
                ]);


            } catch (err) {

                console.error(
                    "Checkout error:",
                    err
                );

                alert(
                    err.message ||
                    "Unable to checkout guest."
                );

            }

        };


    /*
    ============================================================
    DATE FORMATTING
    ============================================================
    */

    const formatTime =
        (dateValue) => {

            if (!dateValue) {
                return "—";
            }

            return new Date(
                dateValue
            ).toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        };


    const formatHeaderDate =
        currentDateTime.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                month: "short",
                day: "numeric"
            }
        );


    const formatHeaderTime =
        currentDateTime.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


    /*
    ============================================================
    LOADING
    ============================================================
    */

    if (loading) {

        return (

            <div className="frontdesk-dashboard">

                <div className="rooms-loading">

                    <div className="loading-spinner"></div>

                    <span>
                        Loading dashboard...
                    </span>

                </div>

            </div>

        );

    }


    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (

        <div className="frontdesk-dashboard">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="dashboard-header">

                <div className="dashboard-welcome">

                    <div className="welcome-icon">

                        <i className="bi bi-grid-1x2-fill"></i>

                    </div>


                    <div className="welcome-content">

                        <div className="welcome-title-row">

                            <h2>
                                Dashboard
                            </h2>

                            <span className="live-badge">

                                <span className="live-dot"></span>

                                Live

                            </span>

                        </div>


                        <p className="welcome-message">

                            Welcome back 👋

                        </p>


                        <div className="hotel-info">

                            <span className="info-item">

                                <i className="bi bi-person-badge"></i>

                                Front Desk

                            </span>

                        </div>

                    </div>

                </div>


                <div className="header-actions">

                    <div className="header-date">

                        <span>
                            {formatHeaderDate}
                        </span>

                        <strong>
                            {formatHeaderTime}
                        </strong>

                    </div>


                    <button className="notification-btn">

                        <i className="bi bi-bell"></i>

                    </button>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="rooms-error">

                    {error}

                </div>

            )}


            {/* =================================================
                TODAY'S OVERVIEW
            ================================================= */}

            <section className="overview-section">

                <div className="section-title">

                    <div>

                        <h4>
                            Today's Overview
                        </h4>

                        <span>
                            Live hotel information
                        </span>

                    </div>

                    <span className="today-label">
                        Today
                    </span>

                </div>


                <div className="overview-grid">


                    {/* Available */}

                    <div className="overview-card available-card">

                        <div className="overview-content">

                            <span>
                                <strong>
                                    Available Rooms
                                </strong>
                            </span>

                            <h3>
                                {availableRooms}
                            </h3>

                        </div>

                        <div className="overview-icon">

                            <i className="bi bi-door-open"></i>

                        </div>

                    </div>


                    {/* Check-ins */}

                    <div className="overview-card checkin-card">

                        <div className="overview-content">

                            <span>
                                <strong>
                                    Today's Check-Ins
                                </strong>
                            </span>

                            <h3>
                                {todaysCheckIns.length}
                            </h3>

                        </div>

                        <div className="overview-icon">

                            <i className="bi bi-box-arrow-in-right"></i>

                        </div>

                    </div>


                    {/* Check-outs */}

                    <div className="overview-card checkout-card">

                        <div className="overview-content">

                            <span>
                                <strong>
                                    Pending Check-Outs
                                </strong>
                            </span>

                            <h3>
                                {todaysCheckOuts.length}
                            </h3>

                        </div>

                        <div className="overview-icon">

                            <i className="bi bi-box-arrow-right"></i>

                        </div>

                    </div>


                    {/* Occupied */}

                    <div className="overview-card occupied-card">

                        <div className="overview-content">

                            <span>
                                <strong>
                                    Occupied Rooms
                                </strong>
                            </span>

                            <h3>
                                {occupiedRooms}
                            </h3>

                        </div>

                        <div className="overview-icon">

                            <i className="bi bi-person-check"></i>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                CHECK-IN / CHECK-OUT
            ================================================= */}

            <div className="activity-grid">


                {/* CHECK-INS */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <h4>
                                Today's Check-Ins
                            </h4>

                            <span>
                                Guests arriving today
                            </span>

                        </div>

                        <button
                            onClick={() =>
                                setShowAllCheckIns(true)
                            }
                        >
                            View All →
                        </button>

                    </div>


                    <div className="activity-list">

                        {todaysCheckIns
                            .slice(0, 3)
                            .map(
                                (item) => (

                                    <div
                                        className="activity-item"
                                        key={item.id}
                                    >

                                        <div className="activity-time">

                                            {formatTime(
                                                item.check_in
                                            )}

                                        </div>


                                        <div className="activity-info">

                                            <strong>
                                                {item.guest_name}
                                            </strong>

                                            <span>
                                                Room{" "}
                                                {item.room_number}
                                                {" • "}
                                                {
                                                    Number(
                                                        item.adults || 0
                                                    ) +
                                                    Number(
                                                        item.children || 0
                                                    )
                                                }{" "}
                                                Guests
                                            </span>

                                        </div>


                                        <span className="completed-badge">

                                            {normalizeStatus(
                                                item.status
                                            ) === "checked_in"
                                                ? "Checked In"
                                                : "Confirmed"}

                                        </span>

                                    </div>

                                )
                            )}


                        {todaysCheckIns.length === 0 && (

                            <div className="empty-room">

                                No check-ins scheduled today.

                            </div>

                        )}

                    </div>

                </div>


                {/* CHECK-OUTS */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <h4>
                                Today's Check-Outs
                            </h4>

                            <span>
                                Guests scheduled to leave today
                            </span>

                        </div>

                        <button
                            onClick={() =>
                                setShowAllCheckOuts(true)
                            }
                        >
                            View All →
                        </button>

                    </div>


                    <div className="activity-list">

                        {todaysCheckOuts
                            .slice(0, 3)
                            .map(
                                (item) => (

                                    <div
                                        className="activity-item"
                                        key={item.id}
                                    >

                                        <div className="activity-info">

                                            <strong>
                                                {item.guest_name}
                                            </strong>

                                            <span>
                                                Room{" "}
                                                {item.room_number}
                                                {" • "}
                                                Checkout{" "}
                                                {formatTime(
                                                    item.check_out
                                                )}
                                            </span>

                                        </div>


                                        <button
                                            className="checkout-btn"
                                            onClick={() =>
                                                handleCheckOut(
                                                    item.id
                                                )
                                            }
                                        >

                                            Check-Out

                                        </button>

                                    </div>

                                )
                            )}


                        {todaysCheckOuts.length === 0 && (

                            <div className="empty-room">

                                No pending check-outs today.

                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* =================================================
                ROOM STATUS
            ================================================= */}

            <div className="dashboard-card room-section">

                <div className="card-header">

                    <div>

                        <h4>
                            Room Status
                        </h4>

                        <span>
                            Current room availability
                        </span>

                    </div>


                    <button
                        onClick={() =>
                            setShowAllRooms(true)
                        }
                    >
                        View All Rooms →
                    </button>

                </div>


                {/* FILTERS */}

                <div className="room-filters">

                    {[
                        "All",
                        "Available",
                        "Occupied",
                        "Reserved",
                        "Cleaning",
                        "Maintenance"
                    ].map(
                        (filter) => (

                            <button
                                key={filter}
                                className={
                                    roomFilter === filter
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setRoomFilter(
                                        filter
                                    )
                                }
                            >

                                {filter}

                            </button>

                        )
                    )}

                </div>


                {/* ROOMS */}

                <div className="rooms-grid">

                    {filteredRooms
                        .slice(0, 8)
                        .map(
                            (room) => (

                                <div
                                    className={
                                        `room-card ${normalizeStatus(
                                            room.status
                                        )}`
                                    }
                                    key={room.id}
                                >

                                    <div className="room-icon">

                                        <i className="bi bi-door-closed"></i>

                                    </div>


                                    <h4>
                                        {room.number}
                                    </h4>


                                    <span>
                                        {room.type}
                                    </span>


                                    <small>
                                        Floor{" "}
                                        {room.floor}
                                    </small>


                                    <strong>
                                        {
                                            normalizeStatus(
                                                room.status
                                            ) === "cleaning"
                                                ? "Cleaning"
                                                : room.status
                                        }
                                    </strong>


                                    {normalizeStatus(
                                        room.status
                                    ) === "cleaning" &&
                                        room.cleaningUntil && (

                                            <small>

                                                Until{" "}

                                                {formatTime(
                                                    room.cleaningUntil
                                                )}

                                            </small>

                                        )}

                                </div>

                            )
                        )}


                    {filteredRooms.length === 0 && (

                        <div className="empty-room">

                            No rooms found.

                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                ALL CHECK-INS MODAL
            ================================================= */}

            {showAllCheckIns && (

                <div className="modal-overlay">

                    <div className="dashboard-modal">

                        <div className="modal-header">

                            <div>

                                <h3>
                                    Today's Check-Ins
                                </h3>

                                <span>
                                    All guests arriving today
                                </span>

                            </div>


                            <button
                                onClick={() =>
                                    setShowAllCheckIns(
                                        false
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="modal-body">

                            {todaysCheckIns.map(
                                (item) => (

                                    <div
                                        className="modal-list-item"
                                        key={item.id}
                                    >

                                        <div>

                                            <strong>
                                                {item.guest_name}
                                            </strong>

                                            <span>
                                                Room{" "}
                                                {item.room_number}
                                                {" • "}
                                                {formatTime(
                                                    item.check_in
                                                )}
                                            </span>

                                        </div>


                                        <span className="completed-badge">

                                            {normalizeStatus(
                                                item.status
                                            ) === "checked_in"
                                                ? "Checked In"
                                                : "Confirmed"}

                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                ALL CHECK-OUTS MODAL
            ================================================= */}

            {showAllCheckOuts && (

                <div className="modal-overlay">

                    <div className="dashboard-modal">

                        <div className="modal-header">

                            <div>

                                <h3>
                                    Today's Check-Outs
                                </h3>

                                <span>
                                    All pending check-outs
                                </span>

                            </div>


                            <button
                                onClick={() =>
                                    setShowAllCheckOuts(
                                        false
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="modal-body">

                            {todaysCheckOuts.map(
                                (item) => (

                                    <div
                                        className="modal-list-item"
                                        key={item.id}
                                    >

                                        <div>

                                            <strong>
                                                {item.guest_name}
                                            </strong>

                                            <span>
                                                Room{" "}
                                                {item.room_number}
                                                {" • "}
                                                Checkout{" "}
                                                {formatTime(
                                                    item.check_out
                                                )}
                                            </span>

                                        </div>


                                        <button
                                            className="checkout-btn"
                                            onClick={() =>
                                                handleCheckOut(
                                                    item.id
                                                )
                                            }
                                        >
                                            Check-Out
                                        </button>

                                    </div>

                                )
                            )}


                            {todaysCheckOuts.length === 0 && (

                                <div className="empty-room">

                                    No pending check-outs today.

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                ALL ROOMS MODAL
            ================================================= */}

            {showAllRooms && (

                <div className="modal-overlay">

                    <div className="rooms-modal">

                        <div className="modal-header">

                            <div>

                                <h3>
                                    Room Status
                                </h3>

                                <span>
                                    All hotel rooms
                                </span>

                            </div>


                            <button
                                onClick={() =>
                                    setShowAllRooms(
                                        false
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* FLOORS */}

                        <div className="floor-tabs">

                            {floors.map(
                                (floor) => (

                                    <button
                                        key={floor}
                                        className={
                                            selectedFloor === floor
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setSelectedFloor(
                                                floor
                                            )
                                        }
                                    >

                                        Floor{" "}
                                        {floor}

                                    </button>

                                )
                            )}

                        </div>


                        {/* FLOOR TITLE */}

                        <div className="floor-title">

                            <h4>
                                Floor{" "}
                                {selectedFloor}
                            </h4>

                            <span>
                                {
                                    floorRooms.length
                                }{" "}
                                Rooms
                            </span>

                        </div>


                        {/* ROOMS */}

                        <div className="rooms-grid all-room-grid">

                            {floorRooms.map(
                                (room) => (

                                    <div
                                        className={
                                            `room-card ${normalizeStatus(
                                                room.status
                                            )}`
                                        }
                                        key={room.id}
                                    >

                                        <div className="room-icon">

                                            <i className="bi bi-door-closed"></i>

                                        </div>


                                        <h4>
                                            {room.number}
                                        </h4>


                                        <span>
                                            {room.type}
                                        </span>


                                        <small>
                                            Floor{" "}
                                            {room.floor}
                                        </small>


                                        <strong>
                                            {
                                                normalizeStatus(
                                                    room.status
                                                ) === "cleaning"
                                                    ? "Cleaning"
                                                    : room.status
                                            }
                                        </strong>


                                        {normalizeStatus(
                                            room.status
                                        ) === "cleaning" &&
                                            room.cleaningUntil && (

                                                <small>

                                                    Until{" "}

                                                    {formatTime(
                                                        room.cleaningUntil
                                                    )}

                                                </small>

                                            )}

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};


export default FrontDeskDashboard;