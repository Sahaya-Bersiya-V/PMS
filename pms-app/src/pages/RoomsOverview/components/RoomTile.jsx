
import {

    FaBed

} from "react-icons/fa";

import "./RoomTile.css";

const RoomTile = ({ room }) => {

    return (

        <div className={`room-tile ${room.status.replace(/\s/g,"").toLowerCase()}`}>

            <FaBed className="room-icon"/>

            <h4>{room.roomNo}</h4>

            <span>

                {room.status}

            </span>

        </div>

    );

};

export default RoomTile;