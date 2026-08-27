import { useEffect, useMemo, useState } from "react";
import "./Rooms.css";

import RoomToolbar from "./Components/RoomToolbar";
import RoomDetailsPanel from "./Components/RoomDetailsPanel";


const API_URL =
    `${import.meta.env.VITE_API_URL}/api/rooms/`;

const Rooms = () => {

    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [selectedRoom, setSelectedRoom] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("all");

    const [roomType, setRoomType] =
        useState("all");

    const [hotel, setHotel] =
        useState("all");

    const [floor, setFloor] =
        useState("all");

    // ============================================================
    // PAGINATION
    // ============================================================

    const [currentPage, setCurrentPage] =
        useState(1);


    /*
    ============================================================
    FORMAT ROOM DATA
    ============================================================
    */

    const formatRooms = (roomData) => {

        return roomData.map((room) => ({

            id: room.id,

            hotelName:
                room.hotel_name || "",

            hotelId:
                room.hotel,

            roomNumber:
                room.room_number || "",

            roomType:
                room.room_type_name || "",

            floor:
                room.floor ?? "",

            capacity:
                room.capacity ?? 0,

            price:
                room.price ?? 0,

            status:
                room.status || "",

            cleaningUntil:
                room.cleaning_until || null,

            notes:
                room.notes || "",

            createdAt:
                room.created_at || null,

            updatedAt:
                room.updated_at || null,

        }));

    };


    /*
    ============================================================
    FETCH ROOMS
    ============================================================
    */

    const fetchRooms = async (
        showLoader = false
    ) => {

        try {

            if (showLoader) {
                setLoading(true);
            }

            setError("");

            const response =
                await fetch(API_URL);

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch rooms."
                );

            }

            const data =
                await response.json();

            const roomData =
                Array.isArray(data)
                    ? data
                    : data.results || [];

            const formattedRooms =
                formatRooms(roomData);

            setRooms(formattedRooms);


            /*
            If currently opened room was updated
            by backend, update the panel too.
            */

            setSelectedRoom((currentRoom) => {

                if (!currentRoom) {
                    return null;
                }

                const updatedRoom =
                    formattedRooms.find(
                        (room) =>
                            room.id === currentRoom.id
                    );

                return updatedRoom || null;

            });

        } catch (err) {

            console.error(
                "Room fetch error:",
                err
            );

            setError(
                "Unable to load rooms from the server."
            );

        } finally {

            if (showLoader) {
                setLoading(false);
            }

        }

    };


    /*
    ============================================================
    INITIAL LOAD + AUTO REFRESH
    ============================================================
    */

    useEffect(() => {

        fetchRooms(true);

        const interval =
            setInterval(() => {

                fetchRooms(false);

            }, 30000);

        return () => {

            clearInterval(interval);

        };

    }, []);


    /*
    ============================================================
    VIEW ROOM
    ============================================================
    */

    const handleView = (room) => {

        setSelectedRoom(room);

    };

    const handleReset = () => {
        setSearch("");
        setStatus("all");
        setRoomType("all");
        setHotel("all");
        setFloor("all");
    };


    /*
    ============================================================
    ROOM TYPES
    ============================================================
    */

    const roomTypes = useMemo(() => {

        const types =
            rooms
                .map(
                    (room) =>
                        room.roomType
                )
                .filter(Boolean);

        return [
            ...new Set(types)
        ];

    }, [rooms]);


    /*
    ============================================================
    FILTER ROOMS
    ============================================================
    */

    const filteredRooms = useMemo(() => {

        const searchValue =
            search
                .toLowerCase()
                .trim();


        return rooms.filter((room) => {

            /*
            SEARCH
            */

            const matchesSearch =
                !searchValue ||

                String(room.roomNumber)
                    .toLowerCase()
                    .includes(searchValue) ||

                String(room.roomType)
                    .toLowerCase()
                    .includes(searchValue) ||

                String(room.floor)
                    .toLowerCase()
                    .includes(searchValue);


            /*
            STATUS
            */

            const matchesStatus =
                status === "all" ||

                String(room.status)
                    .toLowerCase() ===
                    status.toLowerCase();


            /*
            ROOM TYPE
            */

            const matchesRoomType =
                roomType === "all" ||

                room.roomType === roomType;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesRoomType &&
                (hotel === "all" || String(room.hotelId) === String(hotel)) &&
                (floor === "all" || String(room.floor) === String(floor))
            );

        });

    }, [
        rooms,
        search,
        status,
        roomType,
        hotel,
        floor
    ]);


    const hotels = useMemo(() => {
        return Array.from(
            new Map(
                rooms.map((room) => [String(room.hotelId), {
                    id: room.hotelId,
                    name: room.hotelName,
                }])
            ).values()
        ).filter((item) => item.id !== undefined && item.id !== null);
    }, [rooms]);

    const floors = useMemo(() => {
        return [...new Set(rooms.map((room) => room.floor).filter((value) => value !== ""))]
            .sort((first, second) => Number(first) - Number(second));
    }, [rooms]);

    const summary = [
        ["Total Rooms", rooms.length, "All rooms", "total"],
        ["Available Rooms", rooms.filter((room) => room.status === "available").length, "Ready for booking", "available"],
        ["Occupied Rooms", rooms.filter((room) => room.status === "occupied").length, "Currently in use", "occupied"],
        ["Cleaning Rooms", rooms.filter((room) => room.status === "cleaning").length, "Awaiting housekeeping", "cleaning"],
    ];


    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (

        <div className="rooms-page">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="rooms-page-header">

                <div>

                    <h1>
                        Rooms
                    </h1>

                    <p>
                        Manage hotel rooms and availability.
                    </p>

                </div>


                <div className="rooms-header-summary">

                    {summary.map(([label, value, description, tone]) => (
                        <div className={`room-summary-card ${tone}`} key={label}>
                            <span>{label}</span>
                            <strong>{value}</strong>
                            <small>{description}</small>
                        </div>
                    ))}

                </div>

            </div>


            {/* ==================================================
                TOOLBAR
            ================================================== */}

            <RoomToolbar

                search={search}

                status={status}

                roomType={roomType}

                roomTypes={roomTypes}

                hotel={hotel}

                hotels={hotels}

                onSearchChange={setSearch}

                onStatusChange={setStatus}

                onRoomTypeChange={setRoomType}

                onHotelChange={setHotel}

                onReset={handleReset}

            />


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="rooms-error">

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {/* ==================================================
                TABLE
            ================================================== */}

            {loading ? (

                <div className="rooms-loading">

                    <div className="loading-spinner"></div>

                    <span>
                        Loading rooms...
                    </span>

                </div>

            ) : (

                <>

                    <div className="floor-filter" aria-label="Filter rooms by floor">
                        <button type="button" className={floor === "all" ? "active" : ""} onClick={() => setFloor("all")}>
                            All Floors
                        </button>
                        {floors.map((floorValue) => (
                            <button type="button" className={String(floor) === String(floorValue) ? "active" : ""} key={floorValue} onClick={() => setFloor(floorValue)}>
                                Floor {floorValue}
                            </button>
                        ))}
                    </div>

                    <div className="room-tile-grid">
                        {filteredRooms.map((room) => (
                            <article className={`room-tile ${room.status}`} key={room.id}>
                                <div className="room-tile-head">
                                    <span>Room {room.roomNumber}</span>
                                    <strong>{room.status.replaceAll("_", " ")}</strong>
                                </div>
                                <div className="room-tile-door">{room.roomNumber}</div>
                                <div className="room-tile-info">
                                    <strong>{room.roomType || "Room type unavailable"}</strong>
                                    <span>Floor {room.floor} · {room.capacity} guests</span>
                                    <span>₹{Number(room.price).toLocaleString()} / night</span>
                                </div>
                                <button type="button" className="room-view-button" onClick={() => handleView(room)}>
                                    View Details
                                </button>
                            </article>
                        ))}
                        {filteredRooms.length === 0 && (
                            <div className="rooms-empty-tile">No rooms match the selected filters.</div>
                        )}
                    </div>

                    {/* ==================================================
                        ROOM DETAILS PANEL
                    ================================================== */}

                    {selectedRoom && (

                        <RoomDetailsPanel

                            room={selectedRoom}

                            onClose={() =>
                                setSelectedRoom(null)
                            }

                        />

                    )}

                </>

            )}

        </div>

    );

};


export default Rooms;