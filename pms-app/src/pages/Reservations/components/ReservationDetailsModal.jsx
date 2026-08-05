import {
  FaTimes,
  FaEdit,
  FaSignInAlt,
  FaSignOutAlt,
  FaBan,
  FaClipboardList,
  FaUser,
  FaBed,
  FaCreditCard,
  FaCalendarAlt,
} from "react-icons/fa";

import "./ReservationDetailsModal.css";

const ReservationDetailsModal = ({
  isOpen,
  onClose,
  reservation,
}) => {
  if (!isOpen || !reservation) return null;

  return (
    <div className="modal-overlay">

      <div className="reservation-modal">

        <div className="modal-header">

          <h2>Reservation Details</h2>

          <button onClick={onClose}>
            <FaTimes />
          </button>

        </div>

        <div className="modal-body">

          {/* Reservation Information */}

          <section>

            <h3>
    <FaClipboardList />
    Reservation Information
</h3>

            <div className="details-grid">

              <div>
                <label>Reservation ID</label>
                <p>{reservation.id}</p>
              </div>

              <div>
                <label>Status</label>
                <p>{reservation.status}</p>
              </div>

            </div>

          </section>

          {/* Guest */}

          <section>

            <h3> <FaUser />Guest Information</h3>

            <div className="details-grid">

              <div>
                <label>Name</label>
                <p>{reservation.guest}</p>
              </div>

              <div>
                <label>Phone</label>
                <p>{reservation.phone}</p>
              </div>

              <div>
                <label>Email</label>
                <p>{reservation.email}</p>
              </div>

            </div>

          </section>

          {/* Room */}

          <section>

            <h3><FaBed />Room Information</h3>

            <div className="details-grid">

              <div>
                <label>Room</label>
                <p>{reservation.room}</p>
              </div>

              <div>
                <label>Room Type</label>
                <p>{reservation.roomType}</p>
              </div>

            </div>

          </section>

          {/* Stay */}

          <section>

            <h3><FaCalendarAlt />Stay Information</h3>

            <div className="details-grid">

              <div>
                <label>Check-In</label>
                <p>{reservation.checkIn}</p>
              </div>

              <div>
                <label>Check-Out</label>
                <p>{reservation.checkOut}</p>
              </div>

            </div>

          </section>

          {/* Payment */}

          <section>

            <h3><FaCreditCard />Payment</h3>

            <div className="details-grid">

              <div>
                <label>Status</label>
                <p>{reservation.payment}</p>
              </div>

            </div>

          </section>

        </div>

        <div className="modal-footer">

          <button className="edit-btn">
            <FaEdit />
            Edit
          </button>

          {reservation.status === "Confirmed" && (
            <>
              <button className="checkin-btn">
                <FaSignInAlt />
                Check-In
              </button>

              <button className="cancel-btn">
                <FaBan />
                Cancel
              </button>
            </>
          )}

          {reservation.status === "Checked In" && (
            <button className="checkout-btn">
              <FaSignOutAlt />
              <span>Check-Out</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

export default ReservationDetailsModal;