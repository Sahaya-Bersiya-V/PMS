import { useState } from "react";

import "./Guests.css";
import { useHotel } from "../../context/HotelContext";
import GuestToolbar from "./components/GuestToolbar";
import GuestTable from "./components/GuestTable";
import GuestFormModal from "./components/GuestFormModal";

const Guests = () => {
    const { guests } = useHotel();

    const [isModalOpen, setIsModalOpen] = useState(false);

const [mode, setMode] = useState("add");

const [selectedGuest, setSelectedGuest] = useState(null);
const handleAddGuest = () => {

    setMode("add");

    setSelectedGuest(null);

    setIsModalOpen(true);

};
const handleEditGuest = (guest) => {

    setMode("edit");

    setSelectedGuest(guest);

    setIsModalOpen(true);

};

    return (

        <div className="guests-page">

            <GuestToolbar
    onAddGuest={handleAddGuest}
/>

            <GuestTable guests={guests} 
            onEditGuest={handleEditGuest} />
            <GuestFormModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    mode={mode}
    guest={selectedGuest}
/>

        </div>

    );

};

export default Guests;