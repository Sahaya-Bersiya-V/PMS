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
  `${import.meta.env.VITE_API_URL}/api`;

const RESERVATION_API =
  `${API_BASE_URL}/reservations`;

const HOTEL_API =
  `${API_BASE_URL}/hotels`;

const ROOM_TYPE_API =
  `${API_BASE_URL}/room-types`;

const ROOM_API =
  `${API_BASE_URL}/rooms`;


/*
=========================================================
EMPTY FORM
=========================================================
*/

const emptyReservation = {

    hotel: "",

    // Guest
    guest:"",
    guestName: "",
    phone: "",
    email: "",

    identityType: "",
    identityNumber: "",
    address:"",

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
    status: "pending",
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

    roomId:
      item.room || "",

    roomNumber:
      item.room_number || "",

    identityType:
    item.identity_type || "",

    identityNumber:
    item.identity_number || "",

    address:
    item.address || "",

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
const identityOptions = [
    {
        value: "aadhaar",
        label: "Aadhaar",
        numberLabel: "Aadhaar Number",
        placeholder: "Enter Aadhaar Number",
    },
    {
        value: "passport",
        label: "Passport",
        numberLabel: "Passport Number",
        placeholder: "Enter Passport Number",
    },
    {
        value: "driving_license",
        label: "Driving License",
        numberLabel: "Driving License Number",
        placeholder: "Enter Driving License Number",
    },
    {
        value: "voter_id",
        label: "Voter ID",
        numberLabel: "Voter ID Number",
        placeholder: "Enter Voter ID Number",
    },
    {
        value: "other",
        label: "Other",
        numberLabel: "Identity Number",
        placeholder: "Enter Identity Number",
    },
];

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

  const [guestSearch, setGuestSearch] =
    useState("");

const [guestResults, setGuestResults] =
    useState([]);

const [searchingGuest, setSearchingGuest] =
    useState(false);

const [selectedGuestId, setSelectedGuestId] =
    useState(null);

  const [reservations, setReservations] =
    useState([]);

  const [hotels, setHotels] =
    useState([]);

  const [roomTypes, setRoomTypes] =
    useState([]);

  const [availableRooms, setAvailableRooms] =
    useState([]);

  const [rooms, setRooms] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingRooms, setLoadingRooms] =
    useState(false);


  const [selectedReservation, setSelectedReservation] =
    useState(null);

  const [openedFromReservedTile, setOpenedFromReservedTile] =
    useState(false);

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
    floor: "All",
    hotel: "All",
    checkIn: "",
    checkOut: "",
  });

  const [appliedFilters, setAppliedFilters] =
    useState({
      search: "",
      status: "All",
      roomType: "All",
      floor: "All",
      hotel: "All",
      checkIn: "",
      checkOut: "",
    });

  const [showRoomBrowser, setShowRoomBrowser] =
    useState(false);
  // =======================================================
// PAGINATION
// =======================================================

  const RECORDS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);  

  const today = new Date().toISOString().split("T")[0];

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${ROOM_API}/`);

      if (!response.ok) {
        throw new Error("Failed to fetch rooms.");
      }

      const data = await response.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Room fetch error:", error);
      setRooms([]);
    }
  };

  /*
  =======================================================
  INITIAL DATA
  =======================================================
  */

  useEffect(() => {

    fetchReservations();
    fetchHotels();
    fetchRooms();

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


const searchGuests = async () => {

    const value =
        guestSearch.trim();

    if (!value) {
        setGuestResults([]);
        return;
    }

    try {

        setSearchingGuest(true);

        const response =
    await fetch(
        `${RESERVATION_API}/guests/?search=${encodeURIComponent(value)}`
    );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                "Unable to search guests."
            );
        }

        setGuestResults(
            Array.isArray(data)
                ? data
                : []
        );

    } catch (error) {

        console.error(
            "Guest search error:",
            error
        );

        alert(error.message);

    } finally {

        setSearchingGuest(false);

    }
};

const useExistingGuest = (guest) => {

    setSelectedGuestId(
        guest.id
    );

    setFormData((previous) => ({
        ...previous,

        guest:
            guest.id,

        guestName:
            `${guest.first_name || ""} ${
                guest.last_name || ""
            }`.trim(),

        phone:
            guest.phone || "",

        email:
            guest.email || "",

        identityType:
            guest.identity_type || "",

        identityNumber:
            guest.identity_number || "",

        address:
            guest.address || "",
    }));

    setGuestResults([]);
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

    const selectedRoomType = roomTypes.find(
      (type) => String(type.id) === String(roomTypeId)
    );

    setFormData(
      (previous) => ({
        ...previous,

        roomType:
          roomTypeId,

        room: "",
        roomNumber: "",
        price: Number(selectedRoomType?.base_price || 0),
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

    price: Number(
      room.price ||
      roomTypes.find((type) => String(type.id) === String(formData.roomType))?.base_price ||
      0
    ),
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


  const selectedRoom = rooms.find(
    (room) => String(room.id) === String(formData.room)
  ) || availableRooms.find(
    (room) => String(room.id) === String(formData.room)
  );

  const selectedRoomType = roomTypes.find(
    (type) => String(type.id) === String(formData.roomType)
  );

  const effectiveRoomRate = Number(
    formData.price ||
    selectedRoom?.price ||
    selectedRoomType?.base_price ||
    0
  );

  const subtotal =
    effectiveRoomRate *
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
          effectiveRoomRate,

        total_amount:
            Number(grandTotal),

        advance_amount:
          formData.payment === "Paid"
            ? Number(grandTotal)
            : 0,

        booking_source: "walk_in",

        special_requests: "",

        payment_status:
            paymentStatus,

        status:
            formData.status,

        guest: formData.guest
    ? {
        id: Number(formData.guest),
      }
    : {
        guest_id:
            `G${Date.now()}`,

        first_name:
            formData.guestName,

        last_name:
            "",

        phone:
            formData.phone,

        email:
            formData.email || null,

        identity_type:
            formData.identityType,

        identity_number:
            formData.identityNumber,

        address:
            formData.address,
      },
    };

    console.log(
        "Sending reservation:",
        payload
    );

    const response = await fetch(
        `${RESERVATION_API}/`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body:
                JSON.stringify(payload),
        }
    );

    const data =
        await response.json();

    console.log(
        "Backend response:",
        data
    );

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
        effectiveRoomRate,

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
      identity_type:
        formData.identityType,

      identity_number:
        formData.identityNumber,

      address:
        formData.address,
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

  

  const handleSubmit =
  
  async (
    e
  ) => {

    e.preventDefault();


    if (
      !formData.hotel ||
      !formData.guestName ||
      !formData.phone ||
      !formData.identityType ||
      !formData.identityNumber ||
      !formData.address ||
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
    const identityError =
    validateIdentityNumber();

    if (identityError) {

      alert(identityError);

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
        identityType:
            reservation.identityType || "",

        identityNumber:
            reservation.identityNumber || "",

        address:
            reservation.address || "",

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

    console.log("=================================");
    console.log("DATABASE ID:", databaseId);
    console.log("STATUS RECEIVED:", status);
    console.log("STATUS LOWERCASE:", status?.toLowerCase());
    console.log("=================================");

    const normalizedStatus =
      status?.toLowerCase();

    let endpoint = "";
    let method = "PATCH";

    if (normalizedStatus === "checked_in") {

      endpoint =
        `${RESERVATION_API}/${databaseId}/check-in/`;

      method = "POST";

    } else if (normalizedStatus === "checked_out") {

      endpoint =
        `${RESERVATION_API}/${databaseId}/check-out/`;

      method = "POST";

    } else if (normalizedStatus === "cancelled") {

      endpoint =
        `${RESERVATION_API}/${databaseId}/cancel/`;

      method = "POST";

    } else {

      endpoint =
        `${RESERVATION_API}/${databaseId}/`;

      method = "PATCH";

    }

    console.log("FINAL ENDPOINT:", endpoint);
    console.log("FINAL METHOD:", method);

    const response = await fetch(
      endpoint,
      {
        method: method,

        headers: {
          "Content-Type": "application/json",
        },

        ...(method === "PATCH"
          ? {
              body: JSON.stringify({
                status: normalizedStatus,
              }),
            }
          : {}),
      }
    );

    const data =
      await response.json();

    console.log(
      "UPDATE STATUS:",
      response.status
    );

    console.log(
      "UPDATE RESPONSE:",
      data
    );

    if (!response.ok) {

      throw new Error(
        data.error ||
        data.detail ||
        "Unable to update status."
      );

    }

    await fetchReservations();

    setSelectedReservation(
      (prev) => {

        if (!prev) {
          return prev;
        }

        if (
          prev.databaseId !== databaseId
        ) {
          return prev;
        }

        return {
          ...prev,

          status:
            formatStatus(normalizedStatus),

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

const handleMarkPaid = async (databaseId, checkoutAfterPayment = false) => {
  try {
    const response = await fetch(`${RESERVATION_API}/${databaseId}/mark-paid/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to mark payment as paid.");
    }

    await fetchReservations();

    if (checkoutAfterPayment) {
      await updateReservationStatus(databaseId, "checked_out");
      setIsDetailsOpen(false);
      return;
    }

    setSelectedReservation(formatReservation(data));
  } catch (error) {
    window.alert(error.message);
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

    const reservation = reservations.find(
      (item) => item.databaseId === databaseId
    );

    if (reservation?.payment !== "Paid") {
      window.alert("Please click Mark as Paid before checking in this guest.");
      return;
    }

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
    const reservation = reservations.find((item) => item.databaseId === databaseId);

    if (reservation?.payment !== "Paid") {
      window.alert(`This guest needs to pay ₹${Number(reservation?.balance || 0).toLocaleString()} before checkout.`);
      return;
    }

    updateReservationStatus(databaseId, "checked_out");
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
    reservation,
    fromReservedTile = false
  ) => {

    setSelectedReservation(
      reservation
    );

    setOpenedFromReservedTile(fromReservedTile);

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
    setCurrentPage(1);
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
      floor: "All",
      hotel: "All",
      checkIn: "",
      checkOut: "",
    };


    setFilters(
      cleared
    );

    setAppliedFilters(
      cleared
    );
    setCurrentPage(1);
  };

  const roomStatusLabels = {
    occupied: "Occupied",
    reserved: "Reserved",
  };

  const reservationMatchesRoom = (reservation, room) => {
    const roomReferences = [reservation.roomId, reservation.room, reservation.roomNumber];
    const reservationHotelId = String(
      reservation.hotel?.id || reservation.hotel
    );
    const roomHotelId = String(
      room.hotel?.id || room.hotel
    );

    const sameHotel =
      reservationHotelId !== "undefined" &&
      reservationHotelId !== "null" &&
      roomHotelId !== "undefined" &&
      roomHotelId !== "null" &&
      reservationHotelId === roomHotelId;

    const sameRoom = roomReferences.some(
      (reference) => String(reference?.id || reference) === String(room.id) ||
        String(reference?.room_number || reference) === String(room.room_number)
    );

    return sameHotel && sameRoom;
  };


  /*
  =======================================================
  FILTERED DATA
  =======================================================
  */

  const roomStatusFor = (room) => {
    const activeReservation = reservations.find(
      (reservation) => reservationMatchesRoom(reservation, room)
        && ["Pending", "Confirmed", "Checked In"].includes(reservation.status)
    );

    if (activeReservation) {
      return activeReservation.status === "Checked In" ? "occupied" : "reserved";
    }

    return room.status || "available";
  };

  const uniqueRooms = Array.from(
    new Map(rooms.map((room) => [String(room.id), room])).values()
  );

  const roomTiles = uniqueRooms.map((room) => ({
    ...room,
    status: roomStatusFor(room),
    reservation: reservations.find(
      (reservation) => reservationMatchesRoom(reservation, room)
        && ["Pending", "Confirmed", "Checked In"].includes(reservation.status)
    ),
  })).filter(
    (room) => ["reserved", "occupied"].includes(room.status)
  );

  const floors = [...new Set(uniqueRooms.map((room) => room.floor).filter((floor) => floor !== null && floor !== undefined))]
    .sort((first, second) => Number(first) - Number(second));

  const todaysCheckIns = reservations.filter((reservation) =>
    reservation.checkIn === today && !["Cancelled", "No Show"].includes(reservation.status)
  ).length;

  const todaysCheckOuts = reservations.filter((reservation) =>
    reservation.checkOut === today && !["Cancelled", "No Show"].includes(reservation.status)
  ).length;

  const revenue = reservations.reduce((total, reservation) =>
    total + Number(reservation.advance || 0), 0
  );

  const filteredReservations =
    roomTiles.filter(
      (room) => {



        const search =
          appliedFilters.search
            .toLowerCase()
            .trim();


        const matchesSearch =
          !search ||

          String(
            room.room_number || ""
          )
            .toLowerCase()
            .includes(search) ||

          String(
            room.room_type_name || ""
          )
            .toLowerCase()
            .includes(search) ||

          String(
            room.reservation?.guestName || ""
          )
            .toLowerCase()
            .includes(search) ||

          String(
            room.reservation?.phone || ""
          )
            .toLowerCase()
            .includes(search);


        const matchesStatus =
          appliedFilters.status ===
            "All" ||

          room.status ===
            appliedFilters.status;


        const matchesRoomType =
          appliedFilters.roomType ===
            "All" ||

          room.room_type_name ===
            appliedFilters.roomType;

        const matchesFloor =
          appliedFilters.floor === "All" ||
          String(room.floor) === String(appliedFilters.floor);


        const matchesHotel =
          appliedFilters.hotel === "All" ||
          String(room.hotel?.id || room.hotel) === String(appliedFilters.hotel);

        const matchesCheckIn =
          !appliedFilters.checkIn ||
          room.reservation?.checkIn === appliedFilters.checkIn;

        const matchesCheckOut =
          !appliedFilters.checkOut ||
          room.reservation?.checkOut === appliedFilters.checkOut;

        


        return (
          matchesSearch &&
          matchesStatus &&
          matchesRoomType &&
          matchesFloor &&
          matchesHotel &&
          matchesCheckIn &&
          matchesCheckOut
        );
      }
    );

            // =======================================================
// PAGINATION DATA
// =======================================================

const totalPages = Math.ceil(
  filteredReservations.length / RECORDS_PER_PAGE
);

const startIndex =
  (currentPage - 1) * RECORDS_PER_PAGE;

const paginatedReservations =
  filteredReservations.slice(
    startIndex,
    startIndex + RECORDS_PER_PAGE
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
  Validate Identity number
  =======================================================

  */
const validateIdentityNumber = () => {

    const value =
        formData.identityNumber
            .trim();

    if (!value) {

        return "Identity number is required.";

    }


    switch (formData.identityType) {

        case "aadhaar":

            if (!/^\d{12}$/.test(value)) {

                return "Aadhaar number must contain exactly 12 digits.";

            }

            break;


        case "passport":

            if (
                !/^[A-Za-z0-9]{6,9}$/.test(value)
            ) {

                return "Please enter a valid passport number.";

            }

            break;


        case "driving_license":

            if (
                !/^[A-Za-z0-9-]{8,20}$/.test(value)
            ) {

                return "Please enter a valid driving license number.";

            }

            break;


        case "voter_id":

            if (
                !/^[A-Za-z0-9]{8,15}$/.test(value)
            ) {

                return "Please enter a valid Voter ID.";

            }

            break;


        default:
            break;

    }

    return null;

};
  /*
  =======================================================
  RENDER
  =======================================================
  */
 const selectedIdentity = identityOptions.find(
    (option) =>
        option.value === formData.identityType
);

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

      <div className="reservation-summary-grid">
        {[
          ["Total Rooms", rooms.length, "rooms in inventory", "rooms"],
          ["Today's Check-ins", todaysCheckIns, "arrivals scheduled", "checkins"],
          ["Today's Check-outs", todaysCheckOuts, "departures scheduled", "checkouts"],
          ["Revenue", `₹${revenue.toLocaleString()}`, "amount collected", "revenue"],
        ].map(([label, value, description, tone]) => (
          <div className={`reservation-summary-card ${tone}`} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{description}</small>
          </div>
        ))}
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

          {[
            ["occupied", "Occupied"],
            ["reserved", "Reserved"],
          ].map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}

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

          {[...new Set([
            ...roomTypes.map((type) => type.name),
            ...rooms.map((room) => room.room_type_name),
          ].filter(Boolean))].map(
            (type) => (

              <option
                key={type}
                value={type}
              >
                {type}
              </option>

            )
          )}

        </select>

        <select
          value={filters.floor}
          onChange={(e) =>
            setFilters({ ...filters, floor: e.target.value })
          }
        >
          <option value="All">All Floors</option>
          {floors.map((floor) => (
            <option key={floor} value={floor}>Floor {floor}</option>
          ))}
        </select>

        <select
          value={filters.hotel}
          onChange={(e) =>
            setFilters({ ...filters, hotel: e.target.value })
          }
        >
          <option value="All">All Hotels</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
          ))}
        </select>

        <input
          type="date"
          aria-label="Filter by check-in date"
          title="Check-in date"
          value={filters.checkIn}
          onChange={(e) =>
            setFilters({ ...filters, checkIn: e.target.value })
          }
        />

        <input
          type="date"
          aria-label="Filter by check-out date"
          title="Check-out date"
          value={filters.checkOut}
          onChange={(e) =>
            setFilters({ ...filters, checkOut: e.target.value })
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
          Reset
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

        <div className="room-board-heading">
          <div>
            <span className="section-kicker">Live inventory</span>
            <h3>Room floor plan</h3>
          </div>
          <div className="room-legend" aria-label="Room status legend">
            {[["occupied", "Occupied"], ["reserved", "Reserved"]].map(([value, label]) => (
              <span key={value}><i className={`legend-dot ${value}`} />{label}</span>
            ))}
          </div>
        </div>

        {loading && <div className="room-board-empty">Loading rooms...</div>}
        {!loading && rooms.length === 0 && (
          <div className="room-board-empty">No rooms found in the backend.</div>
        )}
        {!loading && rooms.length > 0 && filteredReservations.length === 0 && (
          <div className="room-board-empty">No rooms match these filters.</div>
        )}
        {!loading && rooms.length > 0 && filteredReservations.length > 0 && (
          <div className="room-grid">
            {filteredReservations.map((room) => (
              <article className={`room-tile ${room.status}`} key={room.id}>
                <div className="room-tile-topline">
                  <span className="room-number">{room.room_number}</span>
                  <span className="room-status">{roomStatusLabels[room.status] || room.status}</span>
                </div>
                <div className="room-door"><span>ROOM</span><strong>{room.room_number}</strong></div>
                <div className="room-tile-details">
                  <span>{room.room_type_name || "Room type unavailable"}</span>
                  <span>Floor {room.floor} - {room.capacity || 0} guests</span>
                </div>
                {room.reservation ? (
                  <div className="room-guest">
                    <strong>{room.reservation.guestName || "Guest details unavailable"}</strong>
                    <span>{room.reservation.checkIn} to {room.reservation.checkOut}</span>
                  </div>
                ) : (
                  <div className="room-guest vacant">Ready for check-in</div>
                )}
                {room.reservation && (
                  <button
                    type="button"
                    className={`details-btn ${room.status === "reserved" ? "reserved-details-btn" : ""}`}
                    onClick={() => openDetails(room.reservation, room.status === "reserved")}
                  >
                    {room.status === "reserved" ? "View Reserved Details" : "View Details"}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}

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

                paginatedReservations.map(
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
    PAGINATION
================================= */}

{!loading && filteredReservations.length > 0 && (
  <div className="reservation-pagination">

    <div className="pagination-info">
      Showing{" "}
      <strong>
        {startIndex + 1}
      </strong>
      {" - "}
      <strong>
        {Math.min(
          startIndex + RECORDS_PER_PAGE,
          filteredReservations.length
        )}
      </strong>
      {" of "}
      <strong>
        {filteredReservations.length}
      </strong>
      {" reservations"}
    </div>

    <div className="pagination-controls">

      <button
        className="pagination-btn"
        onClick={() =>
          setCurrentPage((page) =>
            Math.max(page - 1, 1)
          )
        }
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      <span className="pagination-page">
        {currentPage} / {totalPages}
      </span>

      <button
        className="pagination-btn"
        onClick={() =>
          setCurrentPage((page) =>
            Math.min(page + 1, totalPages)
          )
        }
        disabled={
          currentPage === totalPages
        }
      >
        &gt;
      </button>

    </div>

  </div>
)}

     


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
                    <Detail
    label="Identity Type"
    value={
        selectedReservation.identityType ||
        "-"
    }
/>

<Detail
    label="Identity Number"
    value={
        selectedReservation.identityNumber ||
        "-"
    }
/>

<Detail
    label="Address"
    value={
        selectedReservation.address ||
        "-"
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
                  onClick={() => handleEdit(selectedReservation)}
                >
                  Edit
                </button>

                {openedFromReservedTile &&
                  selectedReservation.payment === "Pending" && (
                    <button
                      className="pay-checkout-btn"
                      onClick={() => handleMarkPaid(selectedReservation.databaseId)}
                    >
                      Mark as Paid
                    </button>
                  )}


                {((openedFromReservedTile &&
                  ["Pending", "Confirmed"].includes(selectedReservation.status)) ||
                  (!openedFromReservedTile &&
                    selectedReservation.payment === "Paid" &&
                    selectedReservation.status === "Confirmed")) && (

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

                    selectedReservation.payment === "Paid" ? (
                      <button
                        className="checkout-btn"
                        onClick={() => handleCheckOut(selectedReservation.databaseId)}
                      >
                        Check-Out
                      </button>
                    ) : (
                      <button
                        className="pay-checkout-btn"
                        onClick={() => handleMarkPaid(selectedReservation.databaseId, true)}
                      >
                        Paid, then Check-Out
                      </button>
                    )

                  )}

                {!openedFromReservedTile && [
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

<div className="guest-information-section">

    <div className="section-heading">

        <div className="section-heading-icon">

            <i className="bi bi-person-badge"></i>

        </div>

        <div>

            <h3>
                Guest Information
            </h3>

            <p>
                Enter guest contact and identity details
            </p>

        </div>

    </div>
{/* EXISTING GUEST SEARCH */}

<div className="guest-search-section">

    <label>
        Search Existing Guest
    </label>

    <div className="guest-search-row">

        <input
            type="text"
            placeholder="Search by name, phone, email or guest ID"
            value={guestSearch}
            onChange={(e) =>
                setGuestSearch(e.target.value)
            }
        />

        <button
            type="button"
            onClick={searchGuests}
            disabled={searchingGuest}
        >
            {searchingGuest
                ? "Searching..."
                : "Search"}
        </button>

    </div>

</div>

{guestResults.length > 0 && (

    <div className="guest-search-results">

        {guestResults.map((guest) => (

            <div
                key={guest.id}
                className="guest-result-card"
            >

                <div>

                    <strong>
                        {guest.first_name}{" "}
                        {guest.last_name}
                    </strong>

                    <p>
                        {guest.phone}
                    </p>

                    <p>
                        {guest.email || "No email"}
                    </p>

                    <p>
                        {guest.identity_type || "-"}
                        {" • "}
                        {guest.identity_number || "-"}
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        useExistingGuest(guest)
                    }
                >
                    Use This Guest
                </button>

            </div>

        ))}

    </div>
)}

    <div className="form-grid">

        {/* Guest Name */}

        <div className="field-group">

            <label>
                Guest Name
                <span>*</span>
            </label>

            <div className="input-icon-wrapper">

                <i className="bi bi-person"></i>

                <input
                    name="guestName"
                    type="text"
                    placeholder="Enter guest name"
                    value={
                        formData.guestName
                    }
                    onChange={
                        handleChange
                    }
                    required
                />

            </div>

        </div>


        {/* Phone */}

        <div className="field-group">

            <label>
                Phone Number
                <span>*</span>
            </label>

            <div className="input-icon-wrapper">

                <i className="bi bi-telephone"></i>

                <input
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={
                        formData.phone
                    }
                    onChange={
                        handleChange
                    }
                    required
                />

            </div>

        </div>


        {/* Email */}

        <div className="field-group">

            <label>
                Email
            </label>

            <div className="input-icon-wrapper">

                <i className="bi bi-envelope"></i>

                <input
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={
                        formData.email
                    }
                    onChange={
                        handleChange
                    }
                />

            </div>

        </div>


        {/* Identity Type */}

        <div className="field-group">

            <label>
                Identity Type
                <span>*</span>
            </label>

            <div className="input-icon-wrapper">

                <i className="bi bi-card-text"></i>

                <select
                    name="identityType"
                    value={
                        formData.identityType
                    }
                    onChange={(e) => {

                        setFormData(
                            (previous) => ({
                                ...previous,

                                identityType:
                                    e.target.value,

                                // Clear old number
                                identityNumber:
                                    "",
                            })
                        );

                    }}
                    required
                >

                    <option value="">
                        Select Identity Type
                    </option>

                    {identityOptions.map(
                        (option) => (

                            <option
                                key={
                                    option.value
                                }
                                value={
                                    option.value
                                }
                            >
                                {option.label}
                            </option>

                        )
                    )}

                </select>

            </div>

        </div>


        {/* Identity Number */}

        <div className="field-group">

            <label>

                {selectedIdentity
                    ?.numberLabel ||
                    "Identity Number"}

                <span>*</span>

            </label>

            <div className="input-icon-wrapper">

                <i className="bi bi-person-vcard"></i>

                <input
                    name="identityNumber"
                    type="text"
                    placeholder={
                        selectedIdentity
                            ?.placeholder ||
                        "Select identity type first"
                    }
                    value={
                        formData.identityNumber
                    }
                    onChange={
                        handleChange
                    }
                    disabled={
                        !formData.identityType
                    }
                    required
                />
                

            </div>

        </div>

        {/* Address */}
<div className="field-group full-width">
    <label>
        Address
        <span>*</span>
    </label>

    <div className="input-icon-wrapper textarea-wrapper">
        <i className="bi bi-geo-alt"></i>

        <textarea
            name="address"
            rows="3"
            placeholder="Enter guest address"
            value={formData.address}
            onChange={handleChange}
            required
        />
    </div>
</div>

    </div>

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