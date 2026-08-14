import { FaSearch } from "react-icons/fa";

import "./GuestToolbar.css";

const GuestToolbar = ({
    search,
    onSearch
}) => {

    return (

        <div className="guest-toolbar">

            <div className="toolbar-left">

                <div className="search-box">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search Guest..."
                        value={search}
                        onChange={(e) =>
                            onSearch(
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>

        </div>

    );

};

export default GuestToolbar;