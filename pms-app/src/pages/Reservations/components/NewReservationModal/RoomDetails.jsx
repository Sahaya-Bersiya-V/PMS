
import { FaPlus } from "react-icons/fa";

import RoomCard from "./RoomCard";

import "./RoomDetails.css";

const RoomDetails = ({ rooms, setRooms }) => {


    const addRoom = () => {

    setRooms([
        ...rooms,
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
const updateRoom = (index, field, value) => {

    const updatedRooms = rooms.map((room, i) => {

        if (i === index) {
            return {
                ...room,
                [field]: value,
            };
        }

        return room;
    });

    setRooms(updatedRooms);
};

    const removeRoom=(index)=>{

        setRooms(
            rooms.filter((_,i)=>i!==index)
        );

    };

    return (

        <div className="form-card">

            <div className="room-details-header">

                <h3>🛏 Room Details</h3>

                <button
                    className="add-room-btn"
                    onClick={addRoom}
                >
                    <FaPlus/>

                    Add Room
                </button>

            </div>

            {rooms.map((room,index)=>(

                <RoomCard
    key={index}
    index={index}
    room={room}
    onRemove={() => removeRoom(index)}
    updateRoom={updateRoom}
/>

            ))}

        </div>

    );

};

export default RoomDetails;