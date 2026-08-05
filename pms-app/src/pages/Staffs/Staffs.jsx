import { useState } from "react";

import "./Staff.css";

import staffData from "./data";

import StaffToolbar from "./components/StaffToolbar";
import StaffTable from "./components/StaffTable";

const Staff = () => {

    const [staff] = useState(staffData);

    return (

        <div className="staff-page">

            <StaffToolbar />

            <StaffTable staff={staff} />

        </div>

    );

};

export default Staff;