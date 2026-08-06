import "./ReservationDetails.css";

const ReservationDetails = ({
    reservationInfo,
    setReservationInfo,
    nights,
}) => {

    const handleChange = (e) => {

        const { name, value } = e.target;

        setReservationInfo(prev => ({
            ...prev,
            [name]: value,
        }));

    };

    return (

        <div className="form-card">

            <h3>🏨 Reservation Details</h3>

            <div className="form-grid">

                <div className="form-group">

                    <label>Check-in Date</label>

                    <input
                        type="date"
                        name="checkInDate"
                        value={reservationInfo.checkInDate}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>Check-out Date</label>

                    <input
                        type="date"
                        name="checkOutDate"
                        value={reservationInfo.checkOutDate}
        
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>Check-in Time</label>

                    <input
                        type="time"
                        name="checkInTime"
                        value={reservationInfo.checkInTime}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>Check-out Time</label>

                    <input
                        type="time"
                        name="checkOutTime"
                        value={reservationInfo.checkOutTime}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>Nights</label>

                    <input
                        type="number"
                        value={nights}
                        readOnly
                    />

                </div>

                <div className="form-group">

                    <label>Status</label>

                    <select
                        name="reservationStatus"
                        value={reservationInfo.reservationStatus}
                        onChange={handleChange}
                    >

                        <option>Confirmed</option>

                        <option>Pending</option>

                        <option>Cancelled</option>

                    </select>

                </div>

            </div>

        </div>

    );

};

export default ReservationDetails;