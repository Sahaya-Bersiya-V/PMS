import { useEffect, useMemo, useState } from "react";
import "./Rooms.css";

import RoomToolbar from "./Components/RoomToolbar";
import RoomTable from "./Components/RoomTable";
import RoomDetailsPanel from "./Components/RoomDetailsPanel";


const API_URL =
    "http://127.0.0.1:8000/api/rooms/";

const RECORDS_PER_PAGE = 5;


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
    RESET PAGE WHEN FILTER / SEARCH CHANGES
    ============================================================
    */

    useEffect(() => {

        setCurrentPage(1);

    }, [
        search,
        status,
        roomType
    ]);


    /*
    ============================================================
    PAGINATION
    ============================================================
    */

    const totalPages =
        Math.ceil(
            filteredRooms.length /
            RECORDS_PER_PAGE
        );


    /*
    If current page becomes invalid
    after filtering or auto refresh.
    */

    useEffect(() => {

        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {

            setCurrentPage(totalPages);

        }

        if (totalPages === 0) {

            setCurrentPage(1);

        }

    }, [
        totalPages,
        currentPage
    ]);


    /*
    ============================================================
    GET CURRENT 5 RECORDS
    ============================================================
    */

    const paginatedRooms =
        useMemo(() => {

            const startIndex =
                (currentPage - 1) *
                RECORDS_PER_PAGE;

            const endIndex =
                startIndex +
                RECORDS_PER_PAGE;

            return filteredRooms.slice(
                startIndex,
                endIndex
            );

        }, [
            filteredRooms,
            currentPage
        ]);


    /*
    ============================================================
    PAGINATION BUTTONS
    ============================================================
    */

    const handlePreviousPage = () => {

        setCurrentPage((page) =>
            Math.max(page - 1, 1)
        );

    };


    const handleNextPage = () => {

        setCurrentPage((page) =>
            Math.min(
                page + 1,
                totalPages
            )
        );

    };


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

                        rooms={paginatedRooms}

                        onView={handleView}

                    />


                    {/* ==================================================
                        PAGINATION
                    ================================================== */}

                    {filteredRooms.length > 0 && (
                        
                        <div className="rooms-pagination">

                            <div className="pagination-info">

                                Showing{" "}

                                <strong>
                                    {(
                                        (currentPage - 1) *
                                        RECORDS_PER_PAGE
                                    ) + 1}
                                </strong>

                                {" "}to{" "}

                                <strong>
                                    {Math.min(
                                        currentPage *
                                        RECORDS_PER_PAGE,
                                        filteredRooms.length
                                    )}
                                </strong>

                                {" "}of{" "}

                                <strong>
                                    {filteredRooms.length}
                                </strong>

                                {" "}rooms

                            </div>


                            <div className="pagination-controls">

                                <button
                                    type="button"
                                    className="pagination-arrow"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    &lt;
                                </button>


                                <span className="pagination-page">

                                    {currentPage}

                                </span>


                                <button
                                    type="button"
                                    className="pagination-arrow"
                                    onClick={handleNextPage}
                                    disabled={
                                        currentPage === totalPages
                                    }
                                >
                                    &gt;
                                </button>

                            </div>

                        </div>

                    )}


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