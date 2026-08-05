import "./PersonalDetails.css";

const PersonalDetails = ({ guestData, setGuestData }) => {
  return (
    <div className="form-card">

      <h3>👤 Personal Details</h3>

      <div className="form-grid">

        <div className="form-group">
          <label>Guest Name</label>
          <input
    type="text"
    placeholder="Enter guest name"
    value={guestData.guestName}
    onChange={(e) =>
        setGuestData({
            ...guestData,
            guestName: e.target.value,
        })
    }
/>
        </div>

        <div className="form-group">
          <label>Phone Number</label>
         <input
    type="tel"
    placeholder="Enter phone number"
    value={guestData.phone}
    onChange={(e) =>
        setGuestData({
            ...guestData,
            phone: e.target.value,
        })
    }
/>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
    type="email"
    placeholder="Enter email"
    value={guestData.email}
    onChange={(e) =>
        setGuestData({
            ...guestData,
            email: e.target.value,
        })
    }
/>
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
    type="date"
    value={guestData.dob}
    onChange={(e) =>
        setGuestData({
            ...guestData,
            dob: e.target.value,
        })
    }
/>
        </div>

        <div className="form-group">
          <label>Identity Type</label>
          <select
    value={guestData.identityType}
    onChange={(e) =>
        setGuestData({
            ...guestData,
            identityType: e.target.value,
        })
    }
>
           <option value="">Select</option>
            <option>Aadhaar</option>
            <option>PAN</option>
            <option>Passport</option>
            <option>Driving License</option>
          </select>
        </div>

        <div className="form-group">
          <label>Identity Number</label>
<input
    type="text"
    placeholder="Enter identity number"
    value={guestData.identityNumber}
    onChange={(e) =>
        setGuestData({
            ...guestData,
            identityNumber: e.target.value,
        })
    }
/>        </div>

        <div className="form-group">
          <label>Company Name</label>
<input
    type="text"
    placeholder="Enter Company Name"
    value={guestData.companyName}
    onChange={(e) =>
        setGuestData({
            ...guestData,
           companyName: e.target.value,
        })
    }
/>        </div>

        <div className="form-group">
          <label>GST Number</label>
<input
    type="text"
    placeholder="Enter GST Number"
    value={guestData.gstNumber}
    onChange={(e) =>
        setGuestData({
            ...guestData,
            gstNumber: e.target.value,
        })
    }
/>        </div>

        <div className="form-group full-width">
          <label>Address</label>
          <textarea rows="3" placeholder="Enter address"
  
   
    
    value={guestData.address}
    onChange={(e) =>
        setGuestData({
            ...guestData,
            address: e.target.value,
        })
    }
></textarea>
        </div>

        <div className="form-group">
          <label>Pincode</label>
         <input
    type="text"
    placeholder="Enter PIN Code"
    value={guestData.pincode}
    onChange={(e) =>
        setGuestData({
            ...guestData,
            pincode: e.target.value,
        })
    }
/>
        </div>

        <div className="form-group">
          <label>City</label>
          <input
    type="text"
    placeholder="Enter City"
    value={guestData.city}
    onChange={(e) =>
        setGuestData({
            ...guestData,
            city: e.target.value,
        })
    }
/>
        </div>

        <div className="form-group">
          <label>Country</label>
          <input
    type="text"
    placeholder="Enter Country"
    value={guestData.country}
    onChange={(e) =>
        setGuestData({
            ...guestData,
            country: e.target.value,
        })
    }
/>
        </div>

        <div className="form-group full-width">
          <label>Special Request</label>
          <textarea rows="2" placeholder="Special request"
           
    value={guestData.specialRequest}
    onChange={(e) =>
        setGuestData({
            ...guestData,
            specialRequest: e.target.value,
        })
    }>

          </textarea>
        </div>

        <div className="form-group full-width">
          <label>Notes</label>
          <textarea rows="3" placeholder="Additional notes"
          
    
   
    value={guestData.notes}
    onChange={(e) =>
        setGuestData({
            ...guestData,
            notes: e.target.value,
        })
    }>

          </textarea>
        </div>

      </div>

    </div>
  );
};

export default PersonalDetails;