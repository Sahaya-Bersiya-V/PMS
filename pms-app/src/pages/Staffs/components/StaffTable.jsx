import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

import "./StaffTable.css";
import StaffStatusBadge from "./StaffStatusBadge";

const StaffTable = ({ staff }) => {

    return (

        <div className="staff-table-container">

            <table className="staff-table">

                <thead>

                    <tr>

                        <th>Employee</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Shift</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {staff.map((employee) => (

                        <tr key={employee.id}>

                            <td>

                                <div className="employee-info">

                                    <FaUserCircle className="employee-avatar" />

                                    <div>

                                        <h4>{employee.name}</h4>

                                        <p>{employee.employeeId}</p>

                                    </div>

                                </div>

                            </td>

                            <td>{employee.role}</td>

                            <td>{employee.department}</td>

                            <td>{employee.shift}</td>

                            <td>{employee.phone}</td>

                            <td>{employee.email}</td>

                            <td>

                                <StaffStatusBadge
                                    status={employee.status}
                                />

                            </td>

                            <td>

                                <div className="staff-actions">

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

export default StaffTable;