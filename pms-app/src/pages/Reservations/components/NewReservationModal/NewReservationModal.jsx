import "./NewReservationModal.css";
import { useHotel } from "../../../../context/HotelContext";
import PersonalDetails from "./PersonalDetails";
import RoomDetails from "./RoomDetails";
import BillSummary from "./BillSummary";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import ReservationDetails from "./ReservationDetails";
const NewReservationModal = ({ isOpen, onClose }) => {

    const { saveReservation } = useHotel();
    const [guestData, setGuestData] = useState({
    guestName: "",
    phone: "",
    email: "",
    dob: "",
    address: "",
    pincode: "",
    city: "",
    country: "",
    identityType: "",
    identityNumber: "",
    companyName: "",
    gstNumber: "",
    specialRequest: "",
    notes: "",
});

const [rooms, setRooms] = useState([
    {
        roomType: "",
        roomNumber: "",
        adults: 1,
        children: 0,
        price: 0,
        discount: 0,
        tax: 18,
        total: 0,
    },
]);
if (!isOpen) return null;

 
  

    const validate = () => {

    const guest = guestData;

    if (!guest.guestName.trim()) {

        alert("Guest Name is required");

        return false;
    }

    if (!guest.phone.trim()) {

        alert("Phone Number is required");

        return false;
    }

    if (!guest.email.trim()) {

        alert("Email is required");

        return false;
    }

    if (rooms.length === 0) {

        alert("Please add at least one room");

        return false;
    }
    

    return true;
};
const generateReservationId = () => {

    const now = new Date();

    return `RES-${now.getFullYear()}${String(
        now.getMonth() + 1
    ).padStart(2, "0")}${String(
        now.getDate()
    ).padStart(2, "0")}-${Math.floor(
        Math.random() * 900 + 100
    )}`;

};
// const handleSave = () => {

//     if (!validate()) return;

//     const payload = {

//     reservationId: generateReservationId(),

//     guest: guestData,

//     rooms,

//     createdAt: new Date(),

// };

//     console.log(payload);

//     alert("Reservation Created Successfully");

// };

const handleSave = () => {

    if (!validate()) return;

    const payload = {

        reservationId: generateReservationId(),

        guest: guestData,

        rooms,

        createdAt: new Date(),

    };

    saveReservation(payload);

    console.log(payload);

    alert("Reservation Created Successfully");

    onClose();

};
const handleReset = () => {

    setGuestData({
        guestName: "",
        phone: "",
        email: "",
        dob: "",
        address: "",
        pincode: "",
        city: "",
        country: "",
        identityType: "",
        identityNumber: "",
        companyName: "",
        gstNumber: "",
        specialRequest: "",
        notes: "",
    });

    setRooms([
        {
            roomType: "",
            roomNumber: "",
            adults: 1,
            children: 0,
            price: 0,
            discount: 0,
            tax: 18,
            total: 0,
        },
    ]);

};



    return (

        <div className="reservation-overlay">

            <div className="reservation-form-modal">

                <div className="reservation-form-header">

                    <h2>New Reservation</h2>

                    <button onClick={onClose}>
                        <FaTimes />
                    </button>

                </div>

                <div className="reservation-form-body">

                    <PersonalDetails
    guestData={guestData}
    setGuestData={setGuestData}
/>

                    <RoomDetails
    rooms={rooms}
    setRooms={setRooms}
/>

                    <BillSummary
    rooms={rooms}
/>

                </div>

                <div className="reservation-form-footer">

                    <button
    className="reset-btn"
    onClick={handleReset}
>
    Reset
</button>

                    <button
    className="save-btn"
    onClick={handleSave}
>
    Save Reservation
</button>

                </div>

            </div>

        </div>

    );

};

export default NewReservationModal;