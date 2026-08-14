import { useEffect, useMemo, useState } from "react";
import "./Rooms.css";

import RoomToolbar from "./Components/RoomToolbar";
import RoomTable from "./Components/RoomTable";
import RoomDetailsPanel from "./Components/RoomDetailsPanel";


const Rooms = () => {

    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [selectedRoom, setSelectedRoom] = useState(null);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("all");

    const [roomType, setRoomType] = useState("all");


    /*
    ============================================================
    FETCH ROOMS FROM DJANGO
    ============================================================
    */

    useEffect(() => {

        const fetchRooms = async () => {

            try {

                setLoading(true);

                setError("");

                const response = await fetch(
                    "http://127.0.0.1:8000/api/rooms/"
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch rooms."
                    );

                }


                const data = await response.json();


                /*
                Django DRF may return:

                [
                    {...},
                    {...}
                ]

                OR

                {
                    "results": [...]
                }
                */

                const roomData =
                    Array.isArray(data)
                        ? data
                        : data.results || [];


                /*
                Convert Django fields
                into UI fields
                */

                const formattedRooms =
                    roomData.map((room) => ({

                        id: room.id,

                        hotelName:
                            room.hotel_name || "",

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

                        notes:
                            room.notes || "",

                        createdAt:
                            room.created_at || null,

                        updatedAt:
                            room.updated_at || null,

                    }));


                setRooms(formattedRooms);


            } catch (err) {

                console.error(
                    "Room fetch error:",
                    err
                );

                setError(
                    "Unable to load rooms from the server."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchRooms();

    }, []);


    /*
    ============================================================
    VIEW ROOM
    ============================================================
    */

    const handleView = (room) => {

        console.log(
            "View room:",
            room
        );

        setSelectedRoom(room);

    };


    /*
    ============================================================
    ROOM TYPES
    ============================================================
    */

    const roomTypes = useMemo(() => {

        const types = rooms
            .map((room) => room.roomType)
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
            STATUS FILTER
            */

            const matchesStatus =
                status === "all" ||

                String(room.status)
                    .toLowerCase() ===
                    status.toLowerCase();


            /*
            ROOM TYPE FILTER
            */

            const matchesRoomType =
                roomType === "all" ||

                room.roomType === roomType;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesRoomType
            );

        });

    }, [
        rooms,
        search,
        status,
        roomType
    ]);


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

                    <div className="rooms-count">

                        <strong>
                            {rooms.length}
                        </strong>

                        <span>
                            Total Rooms
                        </span>

                    </div>

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

                onSearchChange={setSearch}

                onStatusChange={setStatus}

                onRoomTypeChange={setRoomType}

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
                    
                    <RoomTable

                        rooms={filteredRooms}

                        onView={handleView}

                    />


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