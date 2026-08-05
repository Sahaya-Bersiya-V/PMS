import "./RoomsOverview.css";

import StatusLegend from "./components/StatusLegend";
import RoomCategory from "./components/RoomCategory";

import { roomCategories } from "./data";

const RoomsOverview = () => {
  return (
    <div className="rooms-overview">

      <StatusLegend />

      {roomCategories.map((category) => (
        <RoomCategory
          key={category.id}
          category={category}
        />
      ))}

    </div>
  );
};

export default RoomsOverview;