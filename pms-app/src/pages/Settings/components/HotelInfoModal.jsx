import { FaTimes } from "react-icons/fa";

import "./HotelInfoModal.css";

const HotelInfoModal = ({ isOpen, onClose }) => {

    if (!isOpen) return null;

    return (

        <div className="modal-overlay">

            <div className="hotel-modal">

                <div className="modal-header">

                    <h2>Hotel Information</h2>

                    <button onClick={onClose}>
                        <FaTimes/>
                    </button>

                </div>

                <div className="modal-body">

                    <div className="hotel-grid">

                        <div className="form-group">
                            <label>Hotel Name</label>
                            <input type="text"/>
                        </div>

                        <div className="form-group">
                            <label>Hotel Logo</label>
                            <input type="file"/>
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="email"/>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text"/>
                        </div>

                        <div className="form-group">
                            <label>Website</label>
                            <input type="text"/>
                        </div>

                        <div className="form-group">
                            <label>GST Number</label>
                            <input type="text"/>
                        </div>

                        <div className="form-group full-width">
                            <label>Address</label>
                            <textarea rows="3"></textarea>
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <input type="text"/>
                        </div>

                        <div className="form-group">
                            <label>State</label>
                            <input type="text"/>
                        </div>

                        <div className="form-group">
                            <label>Country</label>
                            <input type="text"/>
                        </div>

                        <div className="form-group">
                            <label>Pincode</label>
                            <input type="text"/>
                        </div>

                        <div className="form-group">
                            <label>Check-In Time</label>
                            <input type="time"/>
                        </div>

                        <div className="form-group">
                            <label>Check-Out Time</label>
                            <input type="time"/>
                        </div>

                        <div className="form-group">
                            <label>Currency</label>

                            <select>

                                <option>INR</option>
                                <option>USD</option>
                                <option>EUR</option>

                            </select>

                        </div>

                        <div className="form-group">
                            <label>Time Zone</label>

                            <select>

                                <option>Asia/Kolkata</option>
                                <option>UTC</option>

                            </select>

                        </div>

                    </div>

                </div>

                <div className="modal-footer">

                    <button className="reset-btn">

                        Reset

                    </button>

                    <button className="save-btn">

                        Save Changes

                    </button>

                </div>

            </div>

        </div>

    );

};

export default HotelInfoModal;