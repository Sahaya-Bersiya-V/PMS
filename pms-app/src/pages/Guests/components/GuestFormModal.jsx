import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import "./GuestFormModal.css";
import { useHotel } from "../../../context/HotelContext";

const GuestFormModal = ({
    isOpen,
    onClose,
    mode,
    guest,
}) => {

    const initialGuest = {
        guestName: "",
        phone: "",
        email: "",
        dob: "",
        gender: "",
        address: "",
        pincode: "",
        city: "",
        state: "",
        country: "",
        identityType: "",
        identityNumber: "",
        companyName: "",
        gstNumber: "",
        membership: "Regular",
        status: "Active",
        notes: "",
    };
    const { guests, setGuests } = useHotel();

    const [guestData, setGuestData] = useState(initialGuest);

    useEffect(() => {

        if (mode === "edit" && guest) {

            setGuestData({
                ...initialGuest,
                ...guest,
            });

        } else {

            setGuestData(initialGuest);

        }

    }, [mode, guest]);

    if (!isOpen) return null;

    const handleChange = (e) => {

        const { name, value } = e.target;

        setGuestData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

   const handleSubmit = () => {

    if (mode === "add") {

        setGuests(prev => [

            ...prev,

            {

                ...guestData,

                id: Date.now(),

                visits: 1,

            },

        ]);

    }

    else {

        setGuests(prev =>

            prev.map(g =>

                g.id === guest.id

                    ? {

                          ...guestData,

                          id: guest.id,

                          visits: guest.visits,

                      }

                    : g

            )

        );

    }

    onClose();

};

    const handleReset = () => {

        if (mode === "edit" && guest) {

            setGuestData({
                ...initialGuest,
                ...guest,
            });

        } else {

            setGuestData(initialGuest);

        }

    };

    return (

        <div className="guest-overlay">

            <div className="guest-modal">

                <div className="guest-header">

                    <h2>

                        {mode === "add"
                            ? "Add Guest"
                            : "Edit Guest"}

                    </h2>

                    <button onClick={onClose}>

                        <FaTimes />

                    </button>

                </div>

                <div className="guest-body">

                    <div className="form-card">

                        <h3>👤 Personal Details</h3>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Guest Name</label>
                                <input
                                    name="guestName"
                                    value={guestData.guestName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    name="phone"
                                    value={guestData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    name="email"
                                    value={guestData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={guestData.dob}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Gender</label>

                                <select
                                    name="gender"
                                    value={guestData.gender}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select
                                    </option>

                                    <option>Male</option>

                                    <option>Female</option>

                                    <option>Other</option>

                                </select>

                            </div>

                        </div>

                    </div>

                    <div className="form-card">

                        <h3>🪪 Identity Details</h3>

                        <div className="form-grid">

                            <div className="form-group">

                                <label>Identity Type</label>

                                <select
                                    name="identityType"
                                    value={guestData.identityType}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select
                                    </option>

                                    <option>Aadhaar</option>

                                    <option>PAN</option>

                                    <option>Passport</option>

                                    <option>Driving License</option>

                                </select>

                            </div>

                            <div className="form-group">

                                <label>Identity Number</label>

                                <input
                                    name="identityNumber"
                                    value={guestData.identityNumber}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                    </div>

                    <div className="form-card">

                        <h3>📍 Address</h3>

                        <div className="form-grid">

                            <div className="form-group full-width">

                                <label>Address</label>

                                <textarea
                                    rows="3"
                                    name="address"
                                    value={guestData.address}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>Pincode</label>

                                <input
                                    name="pincode"
                                    value={guestData.pincode}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>City</label>

                                <input
                                    name="city"
                                    value={guestData.city}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>State</label>

                                <input
                                    name="state"
                                    value={guestData.state}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>Country</label>

                                <input
                                    name="country"
                                    value={guestData.country}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                    </div>

                    <div className="form-card">

                        <h3>🏢 Other Details</h3>

                        <div className="form-grid">

                            <div className="form-group">

                                <label>Company Name</label>

                                <input
                                    name="companyName"
                                    value={guestData.companyName}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>GST Number</label>

                                <input
                                    name="gstNumber"
                                    value={guestData.gstNumber}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>Membership</label>

                                <select
                                    name="membership"
                                    value={guestData.membership}
                                    onChange={handleChange}
                                >

                                    <option>Regular</option>

                                    <option>Silver</option>

                                    <option>Gold</option>

                                </select>

                            </div>

                            <div className="form-group">

                                <label>Status</label>

                                <select
                                    name="status"
                                    value={guestData.status}
                                    onChange={handleChange}
                                >

                                    <option>Active</option>

                                    <option>Inactive</option>

                                </select>

                            </div>

                            <div className="form-group full-width">

                                <label>Notes</label>

                                <textarea
                                    rows="3"
                                    name="notes"
                                    value={guestData.notes}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                    </div>

                </div>

                <div className="guest-footer">

                    <button
                        className="reset-btn"
                        onClick={handleReset}
                    >
                        Reset
                    </button>

                    <button
                        className="save-btn"
                        onClick={handleSubmit}
                    >
                        {mode === "add"
                            ? "Save Guest"
                            : "Update Guest"}
                    </button>

                </div>

            </div>

        </div>

    );

};

export default GuestFormModal;