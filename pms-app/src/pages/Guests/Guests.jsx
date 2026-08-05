import { useState } from "react";

import "./Guests.css";

import guestData from "./data";

import GuestToolbar from "./components/GuestToolbar";
import GuestTable from "./components/GuestTable";

const Guests = () => {

    const [guests] = useState(guestData);

    return (

        <div className="guests-page">

            <GuestToolbar />

            <GuestTable guests={guests} />

        </div>

    );

};

export default Guests;