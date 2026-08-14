import { useEffect, useState } from "react";

import "./Guests.css";

import GuestToolbar from "./components/GuestToolbar";
import GuestTable from "./components/GuestTable";
import GuestViewModal from "./components/GuestViewModal";


const API_URL =
    "http://127.0.0.1:8000/api/reservations/guests";

const Guests = () => {

    const [guests, setGuests] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [selectedGuest, setSelectedGuest] =
        useState(null);

    const [isViewOpen, setIsViewOpen] =
        useState(false);


    // =========================================
    // GET GUESTS FROM BACKEND
    // =========================================

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


    // =========================================
    // LOAD / SEARCH GUESTS
    // =========================================

    useEffect(() => {

        const timer = setTimeout(() => {

            fetchGuests();

        }, 300);

        return () => clearTimeout(timer);

    }, [search]);


    // =========================================
    // VIEW GUEST
    // =========================================

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


    return (

        <div className="guests-page">

            <GuestToolbar
                search={search}
                onSearch={setSearch}
            />


            <GuestTable
                guests={guests}
                loading={loading}
                onViewGuest={handleViewGuest}
            />


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