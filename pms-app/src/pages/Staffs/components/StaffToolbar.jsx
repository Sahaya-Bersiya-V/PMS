import { FaPlus, FaSearch } from "react-icons/fa";

import "./StaffToolbar.css";

const StaffToolbar = () => {

    return (

        <div className="staff-toolbar">

            <div className="toolbar-left">

                <div className="search-box">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search Employee..."
                    />

                </div>

                <select>
                    <option>All Roles</option>
                    <option>Manager</option>
                    <option>Receptionist</option>
                    <option>Housekeeping</option>
                    <option>Accountant</option>
                </select>

                <select>
                    <option>All Shifts</option>
                    <option>Morning</option>
                    <option>Evening</option>
                    <option>Night</option>
                </select>

                <select>
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>

            </div>

            <button className="add-staff-btn">

                <FaPlus />

                Add Staff

            </button>

        </div>

    );

};

export default StaffToolbar;