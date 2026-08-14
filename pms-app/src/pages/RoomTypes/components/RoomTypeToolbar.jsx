import { FaSearch } from "react-icons/fa";

import "./RoomTypeToolbar.css";


const RoomTypeToolbar = ({
    search,
    status,
    onSearchChange,
    onStatusChange
}) => {

    return (

        <div className="roomtype-toolbar">

            <div className="toolbar-left">

                {/* Search */}

                <div className="search-box">

                    <FaSearch />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            onSearchChange(e.target.value)
                        }
                        placeholder="Search Room Type..."
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

                    <option value="active">
                        Active
                    </option>

                    <option value="inactive">
                        Inactive
                    </option>

                </select>

            </div>

        </div>

    );

};

export default RoomTypeToolbar;