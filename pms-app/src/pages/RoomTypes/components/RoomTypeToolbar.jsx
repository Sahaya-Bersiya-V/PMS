import { FaPlus, FaSearch } from "react-icons/fa";

import "./RoomTypeToolbar.css";

const RoomTypeToolbar = () => {

    return (

        <div className="roomtype-toolbar">

            <div className="toolbar-left">

                <div className="search-box">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search Room Type..."
                    />

                </div>

                <select>

                    <option>All Status</option>

                    <option>Active</option>

                    <option>Inactive</option>

                </select>

            </div>

            <button className="add-roomtype-btn">

                <FaPlus />

                Add Room Type

            </button>

        </div>

    );

};

export default RoomTypeToolbar;