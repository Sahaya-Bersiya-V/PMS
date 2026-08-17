import {
    useEffect,
    useMemo,
    useState
} from "react";

import "./RoomTypes.css";

import RoomTypeToolbar
    from "./components/RoomTypeToolbar";

import RoomTypeTable
    from "./components/RoomTypeTable";

import RoomTypeDetailsPanel
    from "./components/RoomTypeDetailsPanel";


const API_URL =
    "http://127.0.0.1:8000/api/room-types/";

const RECORDS_PER_PAGE = 5;


const RoomTypes = () => {

    const [roomTypes, setRoomTypes] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("all");

    const [selectedRoomType, setSelectedRoomType] =
        useState(null);

    // ============================================================
    // PAGINATION
    // ============================================================

    const [currentPage, setCurrentPage] =
        useState(1);


    /*
    ============================================================
    FETCH ROOM TYPES
    ============================================================
    */

    useEffect(() => {

        const fetchRoomTypes = async () => {

            try {

                setLoading(true);

                setError("");

                const response = await fetch(
                    API_URL
                );

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch room types."
                    );

                }

                const data =
                    await response.json();

                const roomTypeData =
                    Array.isArray(data)
                        ? data
                        : data.results || [];


                /*
                Backend → Frontend
                */

                const formattedRoomTypes =
                    roomTypeData.map((type) => ({

                        id: type.id,

                        hotelId:
                            type.hotel,

                        hotelName:
                            type.hotel_name || "",

                        name:
                            type.name || "",

                        description:
                            type.description || "",

                        capacity:
                            type.capacity ?? 0,

                        basePrice:
                            type.base_price ?? 0,

                        amenities:
                            type.amenities || "",

                        totalRooms:
                            type.total_rooms ?? 0,

                        status:
                            type.status || "inactive",

                        createdAt:
                            type.created_at || null,

                        updatedAt:
                            type.updated_at || null,

                    }));


                setRoomTypes(
                    formattedRoomTypes
                );


            } catch (err) {

                console.error(
                    "Room type fetch error:",
                    err
                );

                setError(
                    "Unable to load room types from the server."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchRoomTypes();

    }, []);


    /*
    ============================================================
    FILTER
    ============================================================
    */

    const filteredRoomTypes = useMemo(() => {

        const searchValue =
            search
                .toLowerCase()
                .trim();


        return roomTypes.filter((type) => {

            const matchesSearch =
                !searchValue ||

                type.name
                    .toLowerCase()
                    .includes(searchValue) ||

                type.hotelName
                    .toLowerCase()
                    .includes(searchValue);


            const matchesStatus =
                status === "all" ||

                type.status
                    .toLowerCase() ===
                    status.toLowerCase();


            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        roomTypes,
        search,
        status
    ]);


    /*
    ============================================================
    RESET PAGE WHEN SEARCH / FILTER CHANGES
    ============================================================
    */

    useEffect(() => {

        setCurrentPage(1);

    }, [
        search,
        status
    ]);


    /*
    ============================================================
    PAGINATION
    ============================================================
    */

    const totalPages =
        Math.ceil(
            filteredRoomTypes.length /
            RECORDS_PER_PAGE
        );


    /*
    Make sure current page is valid
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
    CURRENT PAGE DATA
    ============================================================
    */

    const paginatedRoomTypes =
        useMemo(() => {

            const startIndex =
                (currentPage - 1) *
                RECORDS_PER_PAGE;

            const endIndex =
                startIndex +
                RECORDS_PER_PAGE;

            return filteredRoomTypes.slice(
                startIndex,
                endIndex
            );

        }, [
            filteredRoomTypes,
            currentPage
        ]);


    /*
    ============================================================
    PAGINATION CONTROLS
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
    VIEW
    ============================================================
    */

    const handleView = (roomType) => {

        setSelectedRoomType(
            roomType
        );

    };


    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (

        <div className="room-types-page">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="roomtypes-page-header">

                <div>

                    <h1>
                        Room Types
                    </h1>

                    <p>
                        Manage room categories,
                        pricing and occupancy.
                    </p>

                </div>


                <div className="roomtypes-header-summary">

                    <strong>
                        {roomTypes.length}
                    </strong>

                    <span>
                        Total Types
                    </span>

                </div>

            </div>


            {/* ==================================================
                TOOLBAR
            ================================================== */}

            <RoomTypeToolbar

                search={search}

                status={status}

                onSearchChange={setSearch}

                onStatusChange={setStatus}

            />


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="roomtypes-error">

                    {error}

                </div>

            )}


            {/* ==================================================
                TABLE
            ================================================== */}

            {loading ? (

                <div className="roomtypes-loading">

                    <div className="loading-spinner"></div>

                    <span>
                        Loading room types...
                    </span>

                </div>

            ) : (

                <>

                    <RoomTypeTable

                        roomTypes={
                            paginatedRoomTypes
                        }

                        onView={
                            handleView
                        }

                    />


                    {/* ==================================================
                        PAGINATION
                    ================================================== */}

                    {filteredRoomTypes.length > 0 && (

                        <div className="roomtypes-pagination">


                            {/* INFO */}

                            <div className="roomtypes-pagination-info">

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
                                        filteredRoomTypes.length
                                    )}
                                </strong>

                                {" "}of{" "}

                                <strong>
                                    {filteredRoomTypes.length}
                                </strong>

                                {" "}room types

                            </div>


                            {/* BUTTONS */}

                            <div className="roomtypes-pagination-controls">

                                <button
                                    type="button"
                                    className="roomtypes-pagination-arrow"
                                    onClick={
                                        handlePreviousPage
                                    }
                                    disabled={
                                        currentPage === 1
                                    }
                                >
                                    &lt;
                                </button>


                                <span className="roomtypes-pagination-page">

                                    {currentPage}

                                </span>


                                <button
                                    type="button"
                                    className="roomtypes-pagination-arrow"
                                    onClick={
                                        handleNextPage
                                    }
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
                        VIEW PANEL
                    ================================================== */}

                    {selectedRoomType && (

                        <RoomTypeDetailsPanel

                            roomType={
                                selectedRoomType
                            }

                            onClose={() =>
                                setSelectedRoomType(null)
                            }

                        />

                    )}

                </>

            )}

        </div>

    );

};


export default RoomTypes;