import { FaPlus, FaSearch } from "react-icons/fa";

import "./RoleToolbar.css";

const RoleToolbar = () => {

    return (

        <div className="role-toolbar">

            <div className="toolbar-left">

                <div className="search-box">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search Role..."
                    />

                </div>

            </div>

            <button className="add-role-btn">

                <FaPlus />

                Add Role

            </button>

        </div>

    );

};

export default RoleToolbar;