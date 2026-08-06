import { FaPlus, FaSearch } from "react-icons/fa";

import "./GuestToolbar.css";

const GuestToolbar = ({ onAddGuest }) => {

    return (

        <div className="guest-toolbar">

            <div className="toolbar-left">

                <div className="search-box">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search Guest..."
                    />

                </div>

                <select>

                    <option>All Memberships</option>

                    <option>Gold</option>

                    <option>Silver</option>

                    <option>Regular</option>

                </select>

                <select>

                    <option>All Status</option>

                    <option>Active</option>

                    <option>Inactive</option>

                </select>

            </div>

            <button
    className="add-guest-btn"
    onClick={onAddGuest}
>
    <FaPlus />
    Add Guest
</button>

        </div>

    );

};

export default GuestToolbar;