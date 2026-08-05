import { useState } from "react";

import "./Rooms.css";

import roomData from "./data";

import RoomToolbar from "./components/RoomToolbar";
import RoomTable from "./components/RoomTable";

const Rooms = () => {

    const [rooms, setRooms] = useState(roomData);

    return (

        <div className="rooms-page">

            <RoomToolbar />

            <RoomTable
                rooms={rooms}
            />

        </div>

    );

};

export default Rooms;