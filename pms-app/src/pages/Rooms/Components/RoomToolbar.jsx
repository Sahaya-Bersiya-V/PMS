import { FaSearch } from "react-icons/fa";
import "./RoomToolbar.css";

const RoomToolbar = ({
    search,
    status,
    roomType,
    roomTypes,
    hotel,
    hotels,
    onSearchChange,
    onStatusChange,
    onRoomTypeChange,
    onHotelChange,
    onReset,
}) => {

    return (

        <div className="room-toolbar">

            <div className="room-toolbar-left">

                <select
                    value={hotel}
                    onChange={(e) => onHotelChange(e.target.value)}
                >
                    <option value="all">All Hotels</option>
                    {hotels.map((hotelItem) => (
                        <option key={hotelItem.id} value={hotelItem.id}>
                            {hotelItem.name}
                        </option>
                    ))}
                </select>

                {/* Search */}

                <div className="room-search-box">

                    <FaSearch />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            onSearchChange(e.target.value)
                        }
                        placeholder="Search room, type or floor..."
                    />

                </div>


                {/* Status */}

                <select
                    value={status}
                    onChange={(e) =>
                        onStatusChange(e.target.value)
                    }
                >

                    <option value="all">
                        All Status
                    </option>

                    <option value="available">
                        Available
                    </option>

                    <option value="occupied">
                        Occupied
                    </option>

                    <option value="reserved">
                        Reserved
                    </option>

                    <option value="cleaning">
                        Cleaning
                    </option>

                    <option value="maintenance">
                        Maintenance
                    </option>

                </select>


                {/* Room Type */}

                <select
                    value={roomType}
                    onChange={(e) =>
                        onRoomTypeChange(e.target.value)
                    }
                >

                    <option value="all">
                        All Room Types
                    </option>

                    {roomTypes.map((type) => (

                        <option
                            key={type}
                            value={type}
                        >
                            {type}
                        </option>

                    ))}

                </select>

                <button
                    type="button"
                    className="room-reset-button"
                    onClick={onReset}
                >
                    Reset
                </button>

            </div>

        </div>
    );
};

export default RoomToolbar;