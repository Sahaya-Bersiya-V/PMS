import { useState } from "react";

import "./RoomTypes.css";

import roomTypesData from "./data";

import RoomTypeToolbar from "./components/RoomTypeToolbar";
import RoomTypeTable from "./components/RoomTypeTable";

const RoomTypes = () => {

    const [roomTypes] = useState(roomTypesData);

    return (

        <div className="room-types-page">

            <RoomTypeToolbar />

            <RoomTypeTable roomTypes={roomTypes} />

        </div>

    );

};

export default RoomTypes;