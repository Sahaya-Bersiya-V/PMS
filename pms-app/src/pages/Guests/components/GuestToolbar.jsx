import { FaSearch } from "react-icons/fa";

import "./GuestToolbar.css";

const GuestToolbar = ({
    search,
    onSearch,
    guestFilter,
    onFilter
}) => {

    return (

        <div className="guest-toolbar">

            <div className="toolbar-left">

                <div className="guest-filter-tabs" role="tablist" aria-label="Guest stay filters">
                    {[
                        ["all", "All Guests"],
                        ["in_house", "In House"],
                        ["upcoming", "Upcoming"],
                    ].map(([value, label]) => (
                        <button
                            type="button"
                            key={value}
                            className={guestFilter === value ? "active" : ""}
                            onClick={() => onFilter(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

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