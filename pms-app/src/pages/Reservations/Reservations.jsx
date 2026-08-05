

import { useState } from "react";

import "./Reservations.css";
import ReservationToolbar from "./components/ReservationToolbar";
import ReservationTable from "./components/ReservationTable";
import ReservationDetailsModal from "./components/ReservationDetailsModal";
import NewReservationModal from "./components/NewReservationModal/NewReservationModal";

const Reservations = () => {

    // New Reservation Modal
    const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);

    // Reservation Details Modal
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const openReservationDetails = (reservation) => {
        setSelectedReservation(reservation);
        setIsDetailsModalOpen(true);
    };

    const closeReservationDetails = () => {
        setSelectedReservation(null);
        setIsDetailsModalOpen(false);
    };

    return (
        <div className="reservations">

            <ReservationToolbar
                onNewReservation={() => setIsNewReservationOpen(true)}
            />

            <ReservationTable
                onView={openReservationDetails}
            />

            <NewReservationModal
                isOpen={isNewReservationOpen}
                onClose={() => setIsNewReservationOpen(false)}
            />

            <ReservationDetailsModal
                reservation={selectedReservation}
                isOpen={isDetailsModalOpen}
                onClose={closeReservationDetails}
            />

        </div>
    );
};

export default Reservations;