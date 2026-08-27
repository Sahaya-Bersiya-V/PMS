import { useEffect, useMemo, useState } from "react";

import "./Guests.css";

import GuestToolbar from "./components/GuestToolbar";
import GuestTable from "./components/GuestTable";
import GuestViewModal from "./components/GuestViewModal";


const API_URL =
    `${import.meta.env.VITE_API_URL}/api/reservations/guests`;

const RESERVATIONS_API_URL =
    `${import.meta.env.VITE_API_URL}/api/reservations/`;

const RECORDS_PER_PAGE = 5;


const Guests = () => {
    const [reservations, setReservations] = useState([]);
    const [guestFilter, setGuestFilter] = useState("all");

    const [guests, setGuests] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [selectedGuest, setSelectedGuest] =
        useState(null);

    const [isViewOpen, setIsViewOpen] =
        useState(false);


    /*
    ============================================================
    PAGINATION
    ============================================================
    */

    const [currentPage, setCurrentPage] =
        useState(1);


    /*
    ============================================================
    GET GUESTS FROM BACKEND
    ============================================================
    */

    const fetchGuests = async () => {

        try {

            setLoading(true);

            const params =
                new URLSearchParams();


            if (search.trim()) {

                params.append(
                    "search",
                    search.trim()
                );

            }


            const response = await fetch(
                `${API_URL}/?${params.toString()}`
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch guests"
                );

            }


            const data =
                await response.json();


            setGuests(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                "Guest fetch error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    const fetchReservations = async () => {
        try {
            const response = await fetch(RESERVATIONS_API_URL);
            if (!response.ok) {
                throw new Error("Failed to fetch reservations");
            }
            const data = await response.json();
            setReservations(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Guest reservation status error:", error);
            setReservations([]);
        }
    };


    /*
    ============================================================
    LOAD / SEARCH GUESTS
    ============================================================
    */

    useEffect(() => {

        const timer = setTimeout(() => {

            fetchGuests();
            fetchReservations();

        }, 300);


        return () =>
            clearTimeout(timer);

    }, [search, guestFilter]);


    /*
    ============================================================
    RESET PAGE WHEN SEARCH CHANGES
    ============================================================
    */

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    /*
    ============================================================
    PAGINATION CALCULATION
    ============================================================
    */

    const today = new Date().toISOString().split("T")[0];

    const guestRows = useMemo(() => guests.map((guest) => {
        const guestReservations = reservations.filter(
            (reservation) => String(reservation.guest?.id || reservation.guest) === String(guest.id)
        );
        const active = guestReservations.find((reservation) =>
            String(reservation.status).toLowerCase() === "checked_in"
        );
        const checkingOut = guestReservations.some((reservation) =>
            String(reservation.check_out || "").split("T")[0] === today &&
            !["checked_out", "cancelled", "no_show"].includes(String(reservation.status).toLowerCase())
        );
        const upcoming = guestReservations.some((reservation) =>
            ["pending", "confirmed"].includes(String(reservation.status).toLowerCase()) &&
            String(reservation.check_in || "").split("T")[0] >= today
        );

        const latestReservation = [...guestReservations].sort(
            (first, second) => String(second.updated_at || second.check_out || "")
                .localeCompare(String(first.updated_at || first.check_out || ""))
        )[0];

        const latestStatus = String(latestReservation?.status || "").toLowerCase();

        let stayStatus = "no_reservation";

        if (active) {
            stayStatus = checkingOut ? "checking_out" : "in_house";
        } else if (upcoming) {
            stayStatus = "upcoming";
        } else if (latestStatus === "checked_out") {
            stayStatus = "checked_out";
        } else if (latestStatus === "cancelled") {
            stayStatus = "cancelled";
        } else if (latestStatus === "no_show") {
            stayStatus = "no_show";
        }

        return {
            ...guest,
            stayStatus,
            gender: guest.gender || "",
        };
    }), [guests, reservations, today]);

    const filteredGuests = useMemo(() => guestFilter === "all"
        ? guestRows
        : guestRows.filter((guest) => guest.stayStatus === guestFilter), [guestRows, guestFilter]);

    const totalPages =
        Math.ceil(
            filteredGuests.length /
            RECORDS_PER_PAGE
        );


    /*
    ============================================================
    MAKE SURE PAGE IS VALID
    ============================================================
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
    GET CURRENT 5 GUESTS
    ============================================================
    */

    const startIndex =
        (currentPage - 1) *
        RECORDS_PER_PAGE;


    const endIndex =
        startIndex +
        RECORDS_PER_PAGE;


    const paginatedGuests =
        filteredGuests.slice(
            startIndex,
            endIndex
        );


    /*
    ============================================================
    PREVIOUS PAGE
    ============================================================
    */

    const handlePreviousPage = () => {

        setCurrentPage((page) =>
            Math.max(
                page - 1,
                1
            )
        );

    };


    /*
    ============================================================
    NEXT PAGE
    ============================================================
    */

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
    VIEW GUEST
    ============================================================
    */

    const handleViewGuest = async (guest) => {

        try {

            const response = await fetch(
                `${API_URL}/${guest.id}/`
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to load guest details"
                );

            }


            const data =
                await response.json();


            const derivedGuest = guestRows.find(
                (item) => String(item.id) === String(guest.id)
            );

            setSelectedGuest({
                ...data,
                stayStatus: derivedGuest?.stayStatus || "upcoming",
                gender: derivedGuest?.gender || data.gender || "",
            });

            setIsViewOpen(true);


        } catch (error) {

            console.error(
                "Guest details error:",
                error
            );

        }

    };


    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (
        <div className="guests-page">


            {/* =====================================
                GLASSY PAGE HEADER
            ====================================== */}

            <div className="guests-page-header">

                <div className="guests-header-content">

                    <h1>
                        Guests
                    </h1>

                    <p>
                        Manage guest information and stay history.
                    </p>

                </div>


                <div className="guests-header-summary">

                    <div className="guests-count">

                        <strong>
                            {filteredGuests.length}
                        </strong>

                        <span>
                            Total Guests
                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================
                TOOLBAR
            ====================================== */}

            <GuestToolbar

                search={search}

                onSearch={setSearch}

                guestFilter={guestFilter}

                onFilter={setGuestFilter}

            />


            {/* =====================================
                TABLE
            ====================================== */}

            <GuestTable

                guests={paginatedGuests}

                loading={loading}

                onViewGuest={handleViewGuest}

            />


            {/* =====================================
                PAGINATION
            ====================================== */}

            {filteredGuests.length > 0 && (

                <div className="guests-pagination">


                    {/* PAGINATION INFO */}

                    <div className="guests-pagination-info">

                        Showing{" "}

                        <strong>
                            {startIndex + 1}
                        </strong>

                        {" "}to{" "}

                        <strong>
                            {Math.min(
                                endIndex,
                                guests.length
                            )}
                        </strong>

                        {" "}of{" "}

                        <strong>
                            {filteredGuests.length}
                        </strong>

                        {" "}guests

                    </div>


                    {/* PAGINATION CONTROLS */}

                    <div className="guests-pagination-controls">


                        <button
                            type="button"
                            className="guests-pagination-arrow"
                            onClick={
                                handlePreviousPage
                            }
                            disabled={
                                currentPage === 1
                            }
                        >

                            &lt;

                        </button>


                        <span className="guests-pagination-page">

                            {currentPage}

                        </span>


                        <button
                            type="button"
                            className="guests-pagination-arrow"
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


            {/* =====================================
                VIEW GUEST
            ====================================== */}

            <GuestViewModal

                isOpen={isViewOpen}

                guest={selectedGuest}

                onClose={() =>
                    setIsViewOpen(false)
                }

            />

        </div>

    );

};


export default Guests;