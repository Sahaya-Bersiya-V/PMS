import {
  FaEye,
  FaEdit,
  FaSignInAlt,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

import { reservations } from "../data";
import StatusBadge from "./StatusBadge";

import "./ReservationTable.css";

const ReservationTable = ({onView}) => {
  return (
    <div className="table-card">
      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Guest</th>
            <th>Room</th>
            <th>Room Type</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>

              <td>{reservation.id}</td>

              <td>{reservation.guest}</td>

              <td>{reservation.room}</td>

              <td>{reservation.roomType}</td>

              <td>{reservation.checkIn}</td>

              <td>{reservation.checkOut}</td>

              <td>{reservation.payment}</td>

              <td>
                <StatusBadge status={reservation.status} />
              </td>

              <td className="actions">

                <button className="details-btn"
    onClick={() => onView(reservation)}
>
    <FaEye />
    <span>Details</span>
</button>


              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default ReservationTable;