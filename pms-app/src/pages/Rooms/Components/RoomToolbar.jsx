import { FaPlus, FaSearch } from "react-icons/fa";

import "./RoomToolbar.css";

const RoomToolbar = () => {

    return (

        <div className="room-toolbar">

            <div className="toolbar-left">

                <div className="search-box">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search Room..."
                    />

                </div>

                <select>

                    <option>All Status</option>

                    <option>Available</option>

                    <option>Occupied</option>

                    <option>Needs Cleaning</option>

                </select>

                <select>

                    <option>All Types</option>

                    <option>Standard</option>

                    <option>Deluxe</option>

                    <option>Family</option>

                </select>

            </div>

            <button className="add-room-btn">

                <FaPlus />

                Add Room

            </button>

        </div>

    );

};

export default RoomToolbar;