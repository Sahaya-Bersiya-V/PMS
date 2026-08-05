import { useState } from "react";

import "./Roles.css";

import rolesData from "./data";

import RoleToolbar from "./components/RoleToolbar";
import RoleTable from "./components/RoleTable";

const Roles = () => {

    const [roles] = useState(rolesData);

    return (

        <div className="roles-page">

            <RoleToolbar />

            <RoleTable roles={roles} />

        </div>

    );

};

export default Roles;