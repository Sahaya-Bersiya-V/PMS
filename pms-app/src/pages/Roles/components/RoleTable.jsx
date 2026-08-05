import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";

import "./RoleTable.css";
import RoleStatusBadge from "./RoleStatusBadge";

const RoleTable = ({ roles }) => {

    return (

        <div className="role-table-container">

            <table className="role-table">

                <thead>

                    <tr>

                        <th>Role Name</th>

                        <th>Description</th>

                        <th>Staff Count</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {roles.map((role) => (

                        <tr key={role.id}>

                            <td>{role.name}</td>

                            <td>{role.description}</td>

                            <td>{role.staffCount}</td>

                            <td>

                                <RoleStatusBadge
                                    status={role.status}
                                />

                            </td>

                            <td>

                                <div className="role-actions">

                                    <button className="view-btn">
                                        <MdVisibility />
                                    </button>

                                    <button className="edit-btn">
                                        {/* <MdEdit /> */}
                                        ✏️
                                    </button>

                                    <button className="delete-btn">
                                        <MdDelete />
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

};

export default RoleTable;