// import "./RoomTile.css";

// const colors = {
//   Available: "#22c55e",
//   Occupied: "#ef4444",
//   "Needs Cleaning": "#f59e0b",
// };

// const RoomTile = ({ room }) => {
//   return (
//     <div
//       className="room-tile"
//       style={{
//         borderLeft: `6px solid ${colors[room.status]}`,
//       }}
//     >
//       <h3>Room {room.roomNo}</h3>

//       <span
//         className="status"
//         style={{ color: colors[room.status] }}
//       >
//         {room.status}
//       </span>
//     </div>
//   );
// };

// export default RoomTile;

// import {
//     FaBed,
//     FaCheckCircle,
//     FaTimesCircle,
//     FaBroom,
// } from "react-icons/fa";

// import "./RoomTile.css";

// const RoomTile = ({ room }) => {

//     const statusIcon = {

//         "Available": <FaCheckCircle />,
//         "Occupied": <FaTimesCircle />,
//         "Needs Cleaning": <FaBroom />

//     };

//     return (

//         <div
//             className={`room-tile ${room.status
//                 .replace(/\s/g, "")
//                 .toLowerCase()}`}
//         >

//             <div className="room-number">

//                 <FaBed />

//                 <span>{room.roomNo}</span>

//             </div>

//             <div className="room-status">

//                 {statusIcon[room.status]}

//             </div>

//         </div>

//     );

// };

// export default RoomTile;

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