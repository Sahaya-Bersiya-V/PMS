import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./Reservations.css";

/*
=========================================================
API
=========================================================
*/

// const API_BASE_URL =
//   "http://127.0.0.1:8000/api";
const API_BASE_URL =
  "http://127.0.0.1:8000/api";

const RESERVATION_API =
  `${API_BASE_URL}/reservations`;

const HOTEL_API =
  `${API_BASE_URL}/hotels`;

const ROOM_TYPE_API =
  `${API_BASE_URL}/room-types`;


/*
=========================================================
EMPTY FORM
=========================================================
*/

const emptyReservation = {
  hotel: "",

  guestName: "",
  phone: "",
  email: "",

  room: "",
  roomNumber: "",

  roomType: "",

  checkIn: "",
  checkOut: "",

  adults: 1,
  children: 0,

  price: 0,
  discount: 0,

  payment: "Pending",
  status:"pending",
};


/*
=========================================================
STATUS FORMATTER
=========================================================
*/

const formatStatus = (status) => {

  const statusMap = {
    pending: "Pending",
    confirmed: "Confirmed",
    checked_in: "Checked In",
    checked_out: "Checked Out",
    cancelled: "Cancelled",
    no_show: "No Show",
  };

  return (
    statusMap[status] ||
    status ||
    "Pending"
  );
};


/*
=========================================================
PAYMENT FORMATTER
=========================================================
*/

const formatPayment = (payment) => {

  const paymentMap = {
    pending: "Pending",
    paid: "Paid",
    partial: "Partial",
    failed: "Failed",
    refunded: "Refunded",
  };

  return (
    paymentMap[payment] ||
    payment ||
    "Pending"
  );
};


/*
=========================================================
DATE FORMATTER
=========================================================
*/

const formatDate = (value) => {

  if (!value) {
    return "";
  }

  return String(value).split("T")[0];
};


/*
=========================================================
RESERVATION FORMATTER
=========================================================
*/

const formatReservation = (item) => {

  return {
    id:
      item.reservation_number ||
      `RES${item.id}`,

    databaseId:
      item.id,

    guestName:
      item.guest_name || "",

    phone:
      item.phone || "",

    email:
      item.email || "",

    hotel:
      item.hotel || "",

    hotelName:
      item.hotel_name || "",

    guest:
      item.guest || null,

    room:
      item.room || "",

    roomNumber:
      item.room_number || "",

    roomType:
      item.room_type || "",

    roomTypeId:
      item.room_type_id || "",

    checkIn:
      formatDate(item.check_in),

    checkOut:
      formatDate(item.check_out),

    adults:
      Number(item.adults || 1),

    children:
      Number(item.children || 0),

    numberOfRooms:
      Number(item.number_of_rooms || 1),

    price:
      Number(item.room_rate || 0),

    total:
      Number(item.total_amount || 0),

    advance:
      Number(item.advance_amount || 0),

    balance:
      Number(item.balance_amount || 0),

    payment:
      formatPayment(item.payment_status),

    status:
      formatStatus(item.status),

    bookingSource:
      item.booking_source || "",

    specialRequests:
      item.special_requests || "",
  };
};


/*
=========================================================
MAIN COMPONENT
=========================================================
*/

const Reservations = () => {

  /*
  =======================================================
  STATE
  =======================================================
  */

  const [reservations, setReservations] =
    useState([]);

  const [hotels, setHotels] =
    useState([]);

  const [roomTypes, setRoomTypes] =
    useState([]);

  const [availableRooms, setAvailableRooms] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingRooms, setLoadingRooms] =
    useState(false);


  const [selectedReservation, setSelectedReservation] =
    useState(null);

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyReservation);

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    roomType: "All",
    date: "",
  });

  const [appliedFilters, setAppliedFilters] =
    useState({
      search: "",
      status: "All",
      roomType: "All",
      date: "",
    });

  const [showRoomBrowser, setShowRoomBrowser] =
    useState(false);


  /*
  =======================================================
  INITIAL DATA
  =======================================================
  */

  useEffect(() => {

    fetchReservations();
    fetchHotels();

  }, []);


  /*
  =======================================================
  FETCH RESERVATIONS
  =======================================================
  */

 const fetchReservations = async () => {
  try {
    setLoading(true);

    const response = await fetch(`${RESERVATION_API}/`)

    if (!response.ok) {
      throw new Error(
        "Failed to fetch reservations."
      );
    }

    const data = await response.json();

    setReservations(
      Array.isArray(data)
        ? data.map(formatReservation)
        : []
    );

  } catch (error) {
    console.error(
      "Reservation fetch error:",
      error
    );

    alert(
      "Unable to load reservations from the backend."
    );

  } finally {
    setLoading(false);
  }
};


  /*
  =======================================================
  FETCH HOTELS
  =======================================================
  */
const fetchHotels = async () => {
  try {

    const response = await fetch(`${HOTEL_API}/`)

    if (!response.ok) {
      throw new Error(
        "Failed to fetch hotels."
      );
    }

    const data =
      await response.json();

    setHotels(
      Array.isArray(data)
        ? data
        : []
    );

  } catch (error) {

    console.error(
      "Hotel fetch error:",
      error
    );
  }
};


  /*
  =======================================================
  FETCH ROOM TYPES
  =======================================================
  */

 const fetchRoomTypes = async (hotelId) => {
  if (!hotelId) {
    setRoomTypes([]);
    return [];
  }

  try {
    const response = await fetch(
      `${ROOM_TYPE_API}/?hotel=${hotelId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch room types.");
    }

    const data = await response.json();

    const types = Array.isArray(data) ? data : [];

    setRoomTypes(types);

    return types;

  } catch (error) {

    console.error(
      "Room type fetch error:",
      error
    );

    setRoomTypes([]);

    return [];
  }
};


  /*
  =======================================================
  FETCH AVAILABLE ROOMS
  =======================================================
  */

  const fetchAvailableRooms = async () => {

    if (
      !formData.hotel ||
      !formData.roomType ||
      !formData.checkIn ||
      !formData.checkOut
    ) {

      alert(
        "Please select hotel, room type, check-in and check-out dates."
      );

      return;
    }

    try {

      setLoadingRooms(true);

      const params =
        new URLSearchParams({
          hotel:
            formData.hotel,

          room_type:
            formData.roomType,

          check_in:
            formData.checkIn,

          check_out:
            formData.checkOut,
        });

      const response = await fetch(
        `${API_BASE_URL}/reservations/available-rooms/?${params.toString()}`
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.error ||
          "Unable to fetch available rooms."
        );
      }

      setAvailableRooms(
        Array.isArray(data)
          ? data
          : []
      );

      setShowRoomBrowser(true);

    } catch (error) {

      console.error(
        "Available rooms error:",
        error
      );

      alert(
        error.message
      );

    } finally {

      setLoadingRooms(false);
    }
  };


  /*
  =======================================================
  FORM CHANGE
  =======================================================
  */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };


  /*
  =======================================================
  HOTEL CHANGE
  =======================================================
  */

  const handleHotelChange = (e) => {

    const hotelId =
      e.target.value;

    setFormData(
      (previous) => ({
        ...previous,

        hotel:
          hotelId,

        roomType: "",
        room: "",
        roomNumber: "",
        price: 0,
      })
    );

    setAvailableRooms([]);

    fetchRoomTypes(
      hotelId
    );
  };


  /*
  =======================================================
  ROOM TYPE CHANGE
  =======================================================
  */

  const handleRoomTypeChange = (
    e
  ) => {

    const roomTypeId =
      e.target.value;

    setFormData(
      (previous) => ({
        ...previous,

        roomType:
          roomTypeId,

        room: "",
        roomNumber: "",
        price: 0,
      })
    );

    setAvailableRooms([]);
  };


  /*
  =======================================================
  SELECT ROOM
  =======================================================
  */

  const handleRoomSelect = (room) => {

  setFormData((previous) => ({
    ...previous,

    room: room.id,

    roomNumber: room.room_number,

    price: Number(room.price || 0),
  }));

  setShowRoomBrowser(false);
};


  /*
  =======================================================
  BILL CALCULATION
  =======================================================
  */

  const nights = useMemo(() => {

    if (
      !formData.checkIn ||
      !formData.checkOut
    ) {

      return 0;
    }

    const start =
      new Date(
        formData.checkIn
      );

    const end =
      new Date(
        formData.checkOut
      );

    const difference =
      end.getTime() -
      start.getTime();

    return Math.max(
      0,
      Math.ceil(
        difference /
          (
            1000 *
            60 *
            60 *
            24
          )
      )
    );

  }, [
    formData.checkIn,
    formData.checkOut,
  ]);


  const subtotal =
    Number(formData.price || 0) *
    nights;


  const discount =
    Number(
      formData.discount || 0
    );


  const taxableAmount =
    Math.max(
      0,
      subtotal - discount
    );


  const tax =
    taxableAmount * 0.18;


  const grandTotal =
    taxableAmount + tax;


  /*
  =======================================================
  CREATE RESERVATION
  =======================================================
  */

  const createReservation = async () => {
  const payload = {
    hotel: Number(formData.hotel),

    room: Number(formData.room),

    check_in: `${formData.checkIn}T14:00:00`,

    check_out: `${formData.checkOut}T12:00:00`,

    adults: Number(formData.adults),

    children: Number(formData.children),

    number_of_rooms: 1,

    room_rate: Number(formData.price),

    total_amount: Number(grandTotal),

    advance_amount:
      formData.payment === "Paid"
        ? Number(grandTotal)
        : 0,

    booking_source: "walk_in",

    special_requests: "",

    guest: {
      guest_id: `G${Date.now()}`,

      first_name: formData.guestName,

      last_name: "",

      phone: formData.phone,

      email: formData.email,
    },
  };

  console.log("Sending reservation:", payload);

  const response = await fetch(
    `${RESERVATION_API}/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  console.log("Backend response:", data);

  if (!response.ok) {
    throw new Error(
      data.error ||
      data.detail ||
      "Unable to create reservation."
    );
  }

  return data;
};


  /*
  =======================================================
  UPDATE RESERVATION
  =======================================================
  */

const updateReservation = async () => {
  try {

    const paymentStatus =
      formData.payment === "Paid"
        ? "paid"
        : "pending";

    const payload = {
      hotel: Number(formData.hotel),

      room: Number(formData.room),

      check_in:
        `${formData.checkIn}T14:00:00`,

      check_out:
        `${formData.checkOut}T12:00:00`,

      adults:
        Number(formData.adults),

      children:
        Number(formData.children),

      number_of_rooms: 1,

      room_rate:
        Number(formData.price),

      total_amount:
        Number(grandTotal),

      advance_amount:
        formData.payment === "Paid"
          ? Number(grandTotal)
          : 0,

      payment_status:
        paymentStatus,

      // IMPORTANT
      // Use the status selected in the form
      status:
        formData.status,

      // Update guest information
      guest_name:
        formData.guestName,

      phone:
        formData.phone,

      email:
        formData.email,
    };

    console.log(
      "UPDATE PAYLOAD:",
      payload
    );

    const response = await fetch(
      `${RESERVATION_API}/${editingId}/`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(payload),
      }
    );

    const text =
      await response.text();

    console.log(
      "UPDATE STATUS:",
      response.status
    );

    console.log(
      "UPDATE RESPONSE:",
      text
    );

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `Server returned HTML instead of JSON. HTTP ${response.status}`
      );
    }

    if (!response.ok) {

      console.error(
        "Update response:",
        data
      );

      throw new Error(
        data.error ||
        data.detail ||
        JSON.stringify(data) ||
        "Unable to update reservation."
      );
    }

    console.log(
      "Reservation updated:",
      data
    );

    return data;

  } catch (error) {

    console.error(
      "Update reservation error:",
      error
    );

    throw error;
  }
};


  /*
  =======================================================
  ADD / UPDATE SUBMIT
  =======================================================
  */

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();


    if (
      !formData.hotel ||
      !formData.guestName ||
      !formData.room ||
      !formData.roomType ||
      !formData.checkIn ||
      !formData.checkOut
    ) {

      alert(
        "Please fill all required reservation details."
      );

      return;
    }


    if (nights <= 0) {

      alert(
        "Check-out date must be after check-in date."
      );

      return;
    }


    try {

      setLoading(true);


      if (editingId) {

        await updateReservation();

        alert(
          "Reservation updated successfully."
        );

      } else {

        await createReservation();

        alert(
          "Reservation created successfully."
        );
      }


      await fetchReservations();


      setIsFormOpen(false);

      setEditingId(null);

      setFormData({
        ...emptyReservation,
      });


    } catch (error) {

      console.error(
        "Reservation save error:",
        error
      );

      alert(
        error.message
      );

    } finally {

      setLoading(false);
    }
  };


  /*
  =======================================================
  EDIT
  =======================================================
  */

const handleEdit = async (reservation) => {

    setEditingId(reservation.databaseId);

    const selectedHotel = String(
        reservation.hotel || ""
    );

    let selectedRoomType = String(
        reservation.roomTypeId || ""
    );

    // Fetch room types for selected hotel
    const types = await fetchRoomTypes(
        selectedHotel
    );

    // Find room type from name if ID is unavailable
    if (
        !selectedRoomType &&
        reservation.roomType
    ) {

        const matchingType = types.find(
            (type) =>
                type.name ===
                reservation.roomType
        );

        if (matchingType) {

            selectedRoomType =
                String(matchingType.id);
        }
    }

    setFormData({

        hotel: selectedHotel,

        guest:
            reservation.guest || "",

        guestName:
            reservation.guestName || "",

        phone:
            reservation.phone || "",

        email:
            reservation.email || "",

        room:
            String(
                reservation.room || ""
            ),

        roomNumber:
            reservation.roomNumber || "",

        roomType:
            selectedRoomType,

        // IMPORTANT:
        // date input needs YYYY-MM-DD
        checkIn:
            reservation.checkIn
                ? reservation.checkIn.substring(0, 10)
                : "",

        checkOut:
            reservation.checkOut
                ? reservation.checkOut.substring(0, 10)
                : "",

        adults:
            reservation.adults || 1,

        children:
            reservation.children || 0,

        // Backend field = room_rate
        price:
            Number(
                reservation.price || 0
            ),

        discount:
            Number(
                reservation.discount || 0
            ),

        // Payment status
        payment:
            reservation.payment || "Pending",

        // Reservation status
        status:
            {
              "Pending": "pending",
              "Confirmed": "confirmed",
              "Checked In": "checked_in",
              "Checked Out": "checked_out",
              "Cancelled": "cancelled",
              "No Show": "no_show",
            }[reservation.status] || "pending",
    });

    setAvailableRooms([]);

    setIsDetailsOpen(false);

    setIsFormOpen(true);
};


  /*
  =======================================================
  UPDATE RESERVATION STATUS
  =======================================================
  */

const updateReservationStatus = async (
  databaseId,
  status
) => {
  try {

    let endpoint = "";

    if (status === "checked_in") {

      endpoint =
        `${RESERVATION_API}/${databaseId}/check-in/`;

    } else if (status === "checked_out") {

      endpoint =
        `${RESERVATION_API}/${databaseId}/check-out/`;

    } else if (status === "cancelled") {

      endpoint =
        `${RESERVATION_API}/${databaseId}/cancel/`;

    } else {

      endpoint =
        `${RESERVATION_API}/${databaseId}/`;

    }


    const response = await fetch(
      endpoint,
      {
        method: status === "checked_in" ||
                status === "checked_out" ||
                status === "cancelled"
          ? "POST"
          : "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        ...(status !== "checked_in" &&
          status !== "checked_out" &&
          status !== "cancelled"
          ? {
              body: JSON.stringify({
                status,
              }),
            }
          : {}),
      }
    );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        data.detail ||
        "Unable to update status."
      );

    }


    console.log(
      "Status updated:",
      data
    );


    await fetchReservations();


    setSelectedReservation(
      (prev) => {

        if (!prev) {
          return prev;
        }

        if (
          prev.databaseId !==
          databaseId
        ) {
          return prev;
        }


        return {
          ...prev,

          status:
            formatStatus(status),
        };

      }
    );


  } catch (error) {

    console.error(
      "Status update error:",
      error
    );

    alert(
      error.message
    );

  }
};


  /*
  =======================================================
  CHECK-IN
  =======================================================
  */

  const handleCheckIn = (
    databaseId
  ) => {

    updateReservationStatus(
      databaseId,
      "checked_in"
    );
  };


  /*
  =======================================================
  CHECK-OUT
  =======================================================
  */

  const handleCheckOut = (
    databaseId
  ) => {

    updateReservationStatus(
      databaseId,
      "checked_out"
    );
  };


  /*
  =======================================================
  CANCEL
  =======================================================
  */

  const handleCancel = (
    databaseId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this reservation?"
      );


    if (!confirmed) {
      return;
    }


    updateReservationStatus(
      databaseId,
      "cancelled"
    );
  };


  /*
  =======================================================
  OPEN DETAILS
  =======================================================
  */

  const openDetails = (
    reservation
  ) => {

    setSelectedReservation(
      reservation
    );

    setIsDetailsOpen(true);
  };


  /*
  =======================================================
  FILTER
  =======================================================
  */

  const handleApplyFilter = () => {

    setAppliedFilters({
      ...filters,
    });
  };


  /*
  =======================================================
  CLEAR FILTER
  =======================================================
  */

  const handleClearFilter = () => {

    const cleared = {

      search: "",
      status: "All",
      roomType: "All",
      date: "",
    };


    setFilters(
      cleared
    );

    setAppliedFilters(
      cleared
    );
  };


  /*
  =======================================================
  FILTERED DATA
  =======================================================
  */

  const filteredReservations =
    reservations.filter(
      (reservation) => {

        const search =
          appliedFilters.search
            .toLowerCase()
            .trim();


        const matchesSearch =
          !search ||

          String(
            reservation.id || ""
          )
            .toLowerCase()
            .includes(search) ||

          String(
            reservation.guestName || ""
          )
            .toLowerCase()
            .includes(search) ||

          String(
            reservation.roomNumber || ""
          )
            .toLowerCase()
            .includes(search) ||

          String(
            reservation.phone || ""
          )
            .toLowerCase()
            .includes(search);


        const matchesStatus =
          appliedFilters.status ===
            "All" ||

          reservation.status ===
            appliedFilters.status;


        const matchesRoomType =
          appliedFilters.roomType ===
            "All" ||

          reservation.roomType ===
            appliedFilters.roomType;


        const matchesDate =
          !appliedFilters.date ||

          reservation.checkIn ===
            appliedFilters.date;


        return (
          matchesSearch &&
          matchesStatus &&
          matchesRoomType &&
          matchesDate
        );
      }
    );


  /*
  =======================================================
  RESET FORM
  =======================================================
  */

  const openNewReservation = () => {

    setEditingId(null);

    setFormData({
      ...emptyReservation,
    });

    setRoomTypes([]);

    setAvailableRooms([]);

    setIsDetailsOpen(false);

    setIsFormOpen(true);
  };


  /*
  =======================================================
  RENDER
  =======================================================
  */

  return (

    <div className="reservations-page">

      {/* =================================
          TOP BAR
      ================================= */}

      <div className="reservation-topbar">

        <div>

          <h2>
            Reservations
          </h2>

          <p>
            Manage guest reservations and
            booking status.
          </p>

        </div>


        <div className="reservation-user">

          <span className="topbar-date">

            {new Date().toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            )}

          </span>


          <div className="user-avatar">
            S
          </div>


          <div>

            <strong>
              Sarah
            </strong>

            <small>
              Front Desk
            </small>

          </div>

        </div>

      </div>


      {/* =================================
          FILTER BAR
      ================================= */}

      <div className="reservation-filter-bar">

        <input
          type="text"
          placeholder="Search reservation, guest or room..."
          value={filters.search}
          onChange={(e) =>
            setFilters({
              ...filters,
              search:
                e.target.value,
            })
          }
        />


        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,
              status:
                e.target.value,
            })
          }
        >

          <option value="All">
            All Status
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Checked In">
            Checked In
          </option>

          <option value="Checked Out">
            Checked Out
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>


        <select
          value={filters.roomType}
          onChange={(e) =>
            setFilters({
              ...filters,
              roomType:
                e.target.value,
            })
          }
        >

          <option value="All">
            All Room Types
          </option>

          {roomTypes.map(
            (type) => (

              <option
                key={type.id}
                value={type.name}
              >
                {type.name}
              </option>

            )
          )}

        </select>


        <input
          type="date"
          value={filters.date}
          onChange={(e) =>
            setFilters({
              ...filters,
              date:
                e.target.value,
            })
          }
        />


        <button
          className="filter-btn"
          onClick={
            handleApplyFilter
          }
        >
          Filter
        </button>


        <button
          className="clear-filter-btn"
          onClick={
            handleClearFilter
          }
        >
          Clear
        </button>


        <button
          className="new-reservation-btn"
          onClick={
            openNewReservation
          }
        >
          + New Reservation
        </button>

      </div>


      {/* =================================
          TABLE
      ================================= */}

      <div className="reservation-table-card">

        {loading ? (

          <div className="empty-row">
            Loading reservations...
          </div>

        ) : (

          <table>

            <thead>

              <tr>

                <th>
                  ID
                </th>

                <th>
                  Guest
                </th>

                <th>
                  Room
                </th>

                <th>
                  Room Type
                </th>

                <th>
                  Check-In
                </th>

                <th>
                  Check-Out
                </th>

                <th>
                  Payment
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredReservations.length ===
              0 ? (

                <tr>

                  <td
                    colSpan="9"
                    className="empty-row"
                  >
                    No reservations found.
                  </td>

                </tr>

              ) : (

                filteredReservations.map(
                  (reservation) => (

                    <tr
                      key={
                        reservation.databaseId
                      }
                    >

                      <td>
                        {reservation.id}
                      </td>


                      <td>

                        <strong>
                          {
                            reservation.guestName
                          }
                        </strong>

                      </td>


                      <td>
                        {
                          reservation.roomNumber
                        }
                      </td>


                      <td>
                        {
                          reservation.roomType
                        }
                      </td>


                      <td>
                        {
                          reservation.checkIn
                        }
                      </td>


                      <td>
                        {
                          reservation.checkOut
                        }
                      </td>


                      <td>

                        <span
                          className={
                            `payment-status ${
                              String(
                                reservation.payment ||
                                ""
                              ).toLowerCase()
                            }`
                          }
                        >
                          {
                            reservation.payment
                          }
                        </span>

                      </td>


                      <td>

                        <span
                          className={
                            `reservation-status ${
                              String(
                                reservation.status ||
                                ""
                              )
                                .toLowerCase()
                                .replace(
                                  " ",
                                  "-"
                                )
                            }`
                          }
                        >
                          {
                            reservation.status
                          }
                        </span>

                      </td>


                      <td>

                        <button
                          className="details-btn"
                          onClick={() =>
                            openDetails(
                              reservation
                            )
                          }
                        >
                          View Details
                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        )}

      </div>


      {/* =================================
          DETAILS MODAL
      ================================= */}

      {isDetailsOpen &&
        selectedReservation && (

          <div className="modal-overlay">

            <div className="reservation-details-modal">

              <div className="modal-title">

                <div>

                  <h2>
                    Reservation Details
                  </h2>

                  <span>
                    {
                      selectedReservation.id
                    }
                  </span>

                </div>


                <button
                  onClick={() =>
                    setIsDetailsOpen(false)
                  }
                >
                  ×
                </button>

              </div>


              <div className="details-content">

                {/* Guest */}

                <div className="detail-section">

                  <h3>
                    Guest Information
                  </h3>


                  <div className="detail-grid">

                    <Detail
                      label="Guest Name"
                      value={
                        selectedReservation.guestName
                      }
                    />

                    <Detail
                      label="Phone"
                      value={
                        selectedReservation.phone
                      }
                    />

                    <Detail
                      label="Email"
                      value={
                        selectedReservation.email
                      }
                    />

                  </div>

                </div>


                {/* Hotel */}

                <div className="detail-section">

                  <h3>
                    Hotel Information
                  </h3>


                  <div className="detail-grid">

                    <Detail
                      label="Hotel"
                      value={
                        selectedReservation.hotelName
                      }
                    />

                  </div>

                </div>


                {/* Room */}

                <div className="detail-section">

                  <h3>
                    Room Information
                  </h3>


                  <div className="detail-grid">

                    <Detail
                      label="Room"
                      value={
                        selectedReservation.roomNumber
                      }
                    />

                    <Detail
                      label="Room Type"
                      value={
                        selectedReservation.roomType
                      }
                    />

                    <Detail
                      label="Room Rate"
                      value={
                        `₹${Number(
                          selectedReservation.price ||
                          0
                        ).toLocaleString()} / night`
                      }
                    />

                  </div>

                </div>


                {/* Stay */}

                <div className="detail-section">

                  <h3>
                    Stay Information
                  </h3>


                  <div className="detail-grid">

                    <Detail
                      label="Check-In"
                      value={
                        selectedReservation.checkIn
                      }
                    />

                    <Detail
                      label="Check-Out"
                      value={
                        selectedReservation.checkOut
                      }
                    />

                    <Detail
                      label="Guests"
                      value={
                        `${selectedReservation.adults} Adults, ${selectedReservation.children} Children`
                      }
                    />

                    <Detail
                      label="Nights"
                      value={
                        (() => {

                          const start =
                            new Date(
                              selectedReservation.checkIn
                            );

                          const end =
                            new Date(
                              selectedReservation.checkOut
                            );

                          const diff =
                            end.getTime() -
                            start.getTime();

                          return Math.max(
                            0,
                            Math.ceil(
                              diff /
                                (
                                  1000 *
                                  60 *
                                  60 *
                                  24
                                )
                            )
                          );

                        })()
                      }
                    />

                  </div>

                </div>


                {/* Payment */}

                <div className="detail-section">

                  <h3>
                    Payment
                  </h3>


                  <div className="detail-grid">

                    <Detail
                      label="Payment"
                      value={
                        selectedReservation.payment
                      }
                    />

                    <Detail
                      label="Total"
                      value={
                        `₹${Number(
                          selectedReservation.total ||
                          0
                        ).toLocaleString()}`
                      }
                    />

                    <Detail
                      label="Advance"
                      value={
                        `₹${Number(
                          selectedReservation.advance ||
                          0
                        ).toLocaleString()}`
                      }
                    />

                    <Detail
                      label="Balance"
                      value={
                        `₹${Number(
                          selectedReservation.balance ||
                          0
                        ).toLocaleString()}`
                      }
                    />

                    <Detail
                      label="Status"
                      value={
                        selectedReservation.status
                      }
                    />

                  </div>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  className="edit-btn"
                  onClick={() =>
                    handleEdit(
                      selectedReservation
                    )
                  }
                >
                  Edit
                </button>


                {selectedReservation.payment ===
                  "Paid" &&

                  selectedReservation.status ===
                    "Confirmed" && (

                    <button
                      className="checkin-btn"
                      onClick={() =>
                        handleCheckIn(
                          selectedReservation.databaseId
                        )
                      }
                    >
                      Check-In
                    </button>

                  )}


                {selectedReservation.status ===
                  "Checked In" && (

                    <button
                      className="checkout-btn"
                      onClick={() =>
                        handleCheckOut(
                          selectedReservation.databaseId
                        )
                      }
                    >
                      Check-Out
                    </button>

                  )}


                {[
                  "Pending",
                  "Confirmed",
                ].includes(
                  selectedReservation.status
                ) && (

                  <button
                    className="cancel-btn"
                    onClick={() =>
                      handleCancel(
                        selectedReservation.databaseId
                      )
                    }
                  >
                    Cancel
                  </button>

                )}

              </div>

            </div>

          </div>

        )}


      {/* =================================
          NEW / EDIT FORM
      ================================= */}

      {isFormOpen && (

        <div className="modal-overlay">

          <div className="reservation-form-modal">

            <div className="modal-title">

              <div>

                <h2>

                  {editingId
                    ? "Edit Reservation"
                    : "New Reservation"}

                </h2>

                <span>
                  Enter guest and stay details
                </span>

              </div>


              <button
                onClick={() =>
                  setIsFormOpen(false)
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleSubmit
              }
              className="reservation-form"
            >

              {/* =================================
                  GUEST INFORMATION
              ================================= */}

              <h3>
                Guest Information
              </h3>


              <div className="form-grid">

                <input
                  name="guestName"
                  placeholder="Guest Name *"
                  value={
                    formData.guestName
                  }
                  onChange={
                    handleChange
                  }
                  required
                />


                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                />


                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* =================================
                  STAY INFORMATION
              ================================= */}

              <div className="stay-section">

                <div className="section-heading">

                  <div className="section-heading-icon">

                    <i className="bi bi-calendar-check"></i>

                  </div>


                  <div>

                    <h3>
                      Stay Information
                    </h3>

                    <p>
                      Select the stay dates, hotel,
                      room type and guests
                    </p>

                  </div>

                </div>


                {/* HOTEL */}

                <div className="field-group">

                  <label>

                    Hotel

                    <span>
                      *
                    </span>

                  </label>


                  <div className="input-icon-wrapper">

                    <i className="bi bi-building"></i>


                    <select
                      name="hotel"
                      value={
                        formData.hotel
                      }
                      onChange={
                        handleHotelChange
                      }
                      required
                    >

                      <option value="">
                        Select Hotel
                      </option>


                      {hotels.map(
                        (hotel) => (

                          <option
                            key={
                              hotel.id
                            }
                            value={
                              hotel.id
                            }
                          >
                            {
                              hotel.name
                            }
                          </option>

                        )
                      )}

                    </select>

                  </div>

                </div>


                {/* DATES */}

                <div className="stay-date-grid">

                  <div className="field-group">

                    <label>

                      Check-In Date

                      <span>
                        *
                      </span>

                    </label>


                    <div className="input-icon-wrapper">

                      <i className="bi bi-calendar-event"></i>


                      <input
                        name="checkIn"
                        type="date"
                        value={
                          formData.checkIn
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>


                    <small>
                      Guest arrival date
                    </small>

                  </div>


                  <div className="field-group">

                    <label>

                      Check-Out Date

                      <span>
                        *
                      </span>

                    </label>


                    <div className="input-icon-wrapper">

                      <i className="bi bi-calendar-event"></i>


                      <input
                        name="checkOut"
                        type="date"
                        value={
                          formData.checkOut
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>


                    <small>
                      Guest departure date
                    </small>

                  </div>

                </div>


                {/* ROOM TYPE */}

                <div className="room-selection-area">

                  <div className="field-group">

                    <label>

                      Room Type

                      <span>
                        *
                      </span>

                    </label>


                    <div className="input-icon-wrapper">

                      <i className="bi bi-door-open"></i>


                      <select
                        name="roomType"
                        value={
                          formData.roomType
                        }
                        onChange={
                          handleRoomTypeChange
                        }
                        disabled={
                          !formData.hotel
                        }
                        required
                      >

                        <option value="">
                          Select Room Type
                        </option>


                        {roomTypes.map(
                          (type) => (

                            <option
                              key={
                                type.id
                              }
                              value={
                                type.id
                              }
                            >
                              {
                                type.name
                              }
                            </option>

                          )
                        )}

                      </select>

                    </div>


                    <small>
                      Select the category required
                      by the guest
                    </small>

                  </div>


                  <button
                    type="button"
                    className="browse-rooms-btn"

                    disabled={
                      !formData.hotel ||
                      !formData.roomType ||
                      !formData.checkIn ||
                      !formData.checkOut
                    }

                    onClick={
                      fetchAvailableRooms
                    }
                  >

                    <i className="bi bi-search"></i>

                    {loadingRooms
                      ? "Loading Rooms..."
                      : "Browse Available Rooms"}

                  </button>

                </div>


                {/* SELECTED ROOM */}

                {formData.room ? (

                  <div className="selected-room-card">

                    <div className="selected-room-icon">

                      <i className="bi bi-door-open-fill"></i>

                    </div>


                    <div className="selected-room-details">

                      <span>
                        SELECTED ROOM
                      </span>


                      <strong>
                        Room {
                          formData.roomNumber ||
                          formData.room
                        }
                      </strong>


                      <small>

                        {roomTypes.find(
                          (type) =>
                            String(type.id) ===
                            String(
                              formData.roomType
                            )
                        )?.name ||
                          ""}

                        {" • "}

                        ₹
                        {Number(
                          formData.price || 0
                        ).toLocaleString()}

                        {" / night"}

                      </small>

                    </div>


                    <button
                      type="button"
                      className="change-room-btn"
                      onClick={
                        fetchAvailableRooms
                      }
                    >
                      Change Room
                    </button>

                  </div>

                ) : (

                  <div className="no-room-selected">

                    <div>

                      <i className="bi bi-door"></i>

                    </div>


                    <div>

                      <strong>
                        No room selected
                      </strong>

                      <span>
                        Select a room type and click
                        "Browse Available Rooms"
                      </span>

                    </div>

                  </div>

                )}


                {/* GUEST COUNT */}

                <div className="guest-count-section">

                  <div className="guest-section-title">

                    <i className="bi bi-people"></i>


                    <div>

                      <strong>
                        Guest Details
                      </strong>

                      <span>
                        Enter the number of guests staying
                      </span>

                    </div>

                  </div>


                  <div className="guest-count-grid">

                    {/* Adults */}

                    <div className="guest-input-card">

                      <div className="guest-label">

                        <div className="guest-label-icon adult-icon">

                          <i className="bi bi-person"></i>

                        </div>


                        <div>

                          <strong>
                            Adults
                          </strong>

                          <span>
                            Age 12+
                          </span>

                        </div>

                      </div>


                      <input
                        name="adults"
                        type="number"
                        min="1"
                        value={
                          formData.adults
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>


                    {/* Children */}

                    <div className="guest-input-card">

                      <div className="guest-label">

                        <div className="guest-label-icon child-icon">

                          <i className="bi bi-person"></i>

                        </div>


                        <div>

                          <strong>
                            Children
                          </strong>

                          <span>
                            Under 12
                          </span>

                        </div>

                      </div>


                      <input
                        name="children"
                        type="number"
                        min="0"
                        value={
                          formData.children
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================
                  BILL
              ================================= */}

              <div className="bill-summary">

                <h3>
                  Bill Summary
                </h3>


                <div className="bill-row">

                  <span>
                    Room Rate × {nights} nights
                  </span>

                  <strong>
                    ₹
                    {subtotal.toLocaleString()}
                  </strong>

                </div>


                <div className="bill-row">

                  <span>
                    Discount
                  </span>

                  <strong>
                    - ₹
                    {discount.toLocaleString()}
                  </strong>

                </div>


                <div className="bill-row">

                  <span>
                    Tax (18%)
                  </span>

                  <strong>
                    ₹
                    {tax.toLocaleString()}
                  </strong>

                </div>


                <div className="bill-total">

                  <span>
                    Grand Total
                  </span>

                  <strong>
                    ₹
                    {grandTotal.toLocaleString()}
                  </strong>

                </div>

              </div>


              {/* =================================
                  PAYMENT
              ================================= */}

              <h3>
                Payment Status
              </h3>


              <div className="payment-options">

                <button
                  type="button"

                  className={
                    formData.payment ===
                    "Pending"
                      ? "payment-option active pending"
                      : "payment-option"
                  }

                  onClick={() =>
                    setFormData({
                      ...formData,
                      payment:
                        "Pending",
                    })
                  }
                >
                  Pending
                </button>


                <button
                  type="button"

                  className={
                    formData.payment ===
                    "Paid"
                      ? "payment-option active paid"
                      : "payment-option"
                  }

                  onClick={() =>
                    setFormData({
                      ...formData,
                      payment:
                        "Paid",
                    })
                  }
                >
                  Paid
                </button>

              </div>

              <h3>
  Reservation Status
</h3>

<div className="payment-options">

  <button
    type="button"
    className={
      formData.status === "pending"
        ? "payment-option active pending"
        : "payment-option"
    }
    onClick={() =>
      setFormData({
        ...formData,
        status: "pending",
      })
    }
  >
    Pending
  </button>

  <button
    type="button"
    className={
      formData.status === "confirmed"
        ? "payment-option active paid"
        : "payment-option"
    }
    onClick={() =>
      setFormData({
        ...formData,
        status: "confirmed",
      })
    }
  >
    Confirmed
  </button>

  {/* <button
    type="button"
    className={
      formData.status === "checked_in"
        ? "payment-option active paid"
        : "payment-option"
    }
    onClick={() =>
      setFormData({
        ...formData,
        status: "checked_in",
      })
    }
  >
    Checked In
  </button>

  <button
    type="button"
    className={
      formData.status === "checked_out"
        ? "payment-option active paid"
        : "payment-option"
    }
    onClick={() =>
      setFormData({
        ...formData,
        status: "checked_out",
      })
    }
  >
    Checked Out
  </button> */}

  <button
    type="button"
    className={
      formData.status === "cancelled"
        ? "payment-option active pending"
        : "payment-option"
    }
    onClick={() =>
      setFormData({
        ...formData,
        status: "cancelled",
      })
    }
  >
    Cancelled
  </button>

</div>


              {/* =================================
                  FORM ACTIONS
              ================================= */}

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-form-btn"
                  onClick={() =>
                    setIsFormOpen(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save-reservation-btn"
                  disabled={loading}
                >

                  {loading
                    ? "Saving..."
                    : editingId
                      ? "Update Reservation"
                      : "Save Reservation"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =====================================
          AVAILABLE ROOM BROWSER
      ===================================== */}

      {showRoomBrowser && (

        <div className="modal-overlay room-browser-overlay">

          <div className="room-browser-modal">

            {/* Header */}

            <div className="room-browser-header">

              <div>

                <div className="room-browser-title">

                  <div className="room-browser-icon">

                    <i className="bi bi-door-open-fill"></i>

                  </div>


                  <div>

                    <h2>
                      Select Available Room
                    </h2>


                    <p>

                      {
                        roomTypes.find(
                          (type) =>
                            String(type.id) ===
                            String(
                              formData.roomType
                            )
                        )?.name ||
                        "Room"
                      }

                      {" • "}

                      {formData.checkIn}

                      {" → "}

                      {formData.checkOut}

                    </p>

                  </div>

                </div>

              </div>


              <button
                type="button"
                className="close-room-browser"
                onClick={() =>
                  setShowRoomBrowser(false)
                }
              >
                ×
              </button>

            </div>


            {/* Room summary */}

            <div className="room-browser-summary">

              <div>

                <i className="bi bi-check-circle"></i>

                <span>

                  Showing available{" "}

                  {
                    roomTypes.find(
                      (type) =>
                        String(type.id) ===
                        String(
                          formData.roomType
                        )
                    )?.name ||
                    ""
                  }

                  {" "}rooms

                </span>

              </div>


              <strong>

                {availableRooms.length}

                {" "}Available

              </strong>

            </div>


            {/* Room cards */}
{/* Room cards */}

<div className="available-room-grid">

  {availableRooms.length > 0 ? (

    availableRooms.map((room) => (

      <button
        type="button"
        key={room.id}
        className="available-room-card"
        onClick={() => handleRoomSelect(room)}
      >

        {/* Top */}

        <div className="room-card-top">

          <div className="room-number-icon">

            <i className="bi bi-door-open"></i>

          </div>

          <span className="available-label">
            Available
          </span>

        </div>


        {/* Room Number */}

        <div className="room-number">

          Room {room.room_number}

        </div>


        {/* Room Information */}

        <div className="room-card-info">

          <span>

            <i className="bi bi-building"></i>

            Floor {room.floor}

          </span>


          <span>

            <i className="bi bi-tag"></i>

            {room.room_type}

          </span>

        </div>


        {/* Capacity */}

        <div className="room-card-info">

          <span>

            <i className="bi bi-people"></i>

            {room.capacity} Guests

          </span>

        </div>


        {/* Price */}

        <div className="room-card-price">

          <strong>

            ₹
            {Number(
              room.price || 0
            ).toLocaleString()}

          </strong>

          <span>
            / night
          </span>

        </div>


        {/* Select */}

        <div className="select-room-text">

          Select Room

          <i className="bi bi-arrow-right"></i>

        </div>

      </button>

    ))

  ) : (

    <div className="no-available-rooms">

      <i className="bi bi-door-closed"></i>


      <h3>
        No Rooms Available
      </h3>


      <p>

        There are no available{" "}

        {
          roomTypes.find(
            (type) =>
              String(type.id) ===
              String(formData.roomType)
          )?.name || ""
        }

        {" "}rooms for the selected dates.

      </p>

    </div>

  )}

</div>

          </div>

        </div>

      )}

    </div>
  );
};


/*
=========================================================
DETAIL COMPONENT
=========================================================
*/

const Detail = ({
  label,
  value,
}) => (

  <div className="detail-item">

    <span>
      {label}
    </span>

    <strong>
      {value || "-"}
    </strong>

  </div>
);


export default Reservations;