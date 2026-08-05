import RoomTile from "./RoomTile";

import "./RoomCategory.css";

const RoomCategory = ({ category }) => {
  return (
    <section className="room-category">

      <h2>{category.category}</h2>

      <div className="room-grid">

        {category.rooms.map((room) => (
          <RoomTile
            key={room.roomNo}
            room={room}
          />
        ))}

      </div>

    </section>
  );
};

export default RoomCategory;
