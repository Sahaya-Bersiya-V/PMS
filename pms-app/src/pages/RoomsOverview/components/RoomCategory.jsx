// import RoomTile from "./RoomTile";
// import { FaHotel } from "react-icons/fa";
// import "./RoomCategory.css";

// const RoomCategory = ({ category }) => {
//   return (
//     <section className="room-category">

// <h2>

//     <FaHotel
//         style={{
//             marginRight:"8px",
//             color:"#2563eb"
//         }}
//     />

//     {category.category}

// </h2>
//       <div className="room-grid">

//         {category.rooms.map((room) => (
//           <RoomTile
//             key={room.roomNo}
//             room={room}
//           />
//         ))}

//       </div>

//     </section>
//   );
// };

// export default RoomCategory;

import {
    FaBed,
    FaUsers
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { MdKingBed } from "react-icons/md";

import RoomTile from "./RoomTile";

import "./RoomCategory.css";

const icons = {

    "Standard Room": <FaBed />,

    "Deluxe Room": <MdKingBed />,

    "Family Room": <FaUsers />

};

const RoomCategory = ({ category,onViewAll, }) => {
    const navigate = useNavigate();

    return (

        <section className="room-category">

            <div className="room-category-header">

                <h2>

                    {icons[category.category]}

                    {category.category}

                </h2>

                <span>

                    {category.rooms.length} Rooms

                </span>

            </div>

            <div className="room-grid">

                {/* {category.rooms.map(room => (

                    <RoomTile

                        key={room.roomNo}

                        room={room}

                    />

                ))} */}
                {category.rooms.slice(0, 6).map((room) => (

    <RoomTile
        key={room.roomNo}
        room={room}
    />

))}
{/* <div
    className="view-all-tile"
    onClick={() => navigate("/rooms-overview")}
>

    <span>+</span>

    <p>View All</p>

</div> */}
<div
    className="view-all-tile"
    onClick={() => onViewAll(category)}
>

    <span>+</span>

    <p>View All</p>

</div>

            </div>

        </section>

    );

};

export default RoomCategory;