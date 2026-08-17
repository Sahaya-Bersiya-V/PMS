import { useEffect, useState } from "react";

import "./Guests.css";

import GuestToolbar from "./components/GuestToolbar";
import GuestTable from "./components/GuestTable";
import GuestViewModal from "./components/GuestViewModal";


const API_URL =
    "http://127.0.0.1:8000/api/reservations/guests";

const RECORDS_PER_PAGE = 5;


const Guests = () => {

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


    /*
    ============================================================
    LOAD / SEARCH GUESTS
    ============================================================
    */

    useEffect(() => {

        const timer = setTimeout(() => {

            fetchGuests();

        }, 300);


        return () =>
            clearTimeout(timer);

    }, [search]);


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

    const totalPages =
        Math.ceil(
            guests.length /
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
        guests.slice(
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


            setSelectedGuest(data);

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
                            {guests.length}
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

            {guests.length > 0 && (

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
                            {guests.length}
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