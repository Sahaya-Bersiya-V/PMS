// import React, { useState } from "react";
// import "../styles/FrontDeskDashboard.css";



// const roomsData = [
//   {
//     number: "101",
//     type: "Standard",
//     floor: 1,
//     status: "Available",
//   },
//   {
//     number: "102",
//     type: "Standard",
//     floor: 1,
//     status: "Occupied",
//   },
//   {
//     number: "103",
//     type: "Standard",
//     floor: 1,
//     status: "Cleaning",
//   },
//   {
//     number: "104",
//     type: "Deluxe",
//     floor: 2,
//     status: "Available",
//   },
//   {
//     number: "105",
//     type: "Deluxe",
//     floor: 2,
//     status: "Occupied",
//   },
//   {
//     number: "201",
//     type: "Deluxe",
//     floor: 2,
//     status: "Available",
//   },
//   {
//     number: "202",
//     type: "Family",
//     floor: 3,
//     status: "Cleaning",
//   },
//   {
//     number: "203",
//     type: "Family",
//     floor: 3,
//     status: "Available",
//   },
// ];

// const checkIns = [
//   {
//     time: "09:30 AM",
//     guest: "Arun Kumar",
//     room: "101",
//     guests: 2,
//   },
//   {
//     time: "11:00 AM",
//     guest: "Priya Thomas",
//     room: "203",
//     guests: 3,
//   },
//   {
//     time: "12:30 PM",
//     guest: "John Mathew",
//     room: "305",
//     guests: 2,
//   },
// ];

// const checkOuts = [
//   {
//     guest: "Rahul Kumar",
//     room: "102",
//   },
//   {
//     guest: "Maria Joseph",
//     room: "201",
//   },
//   {
//     guest: "David John",
//     room: "304",
//   },
// ];

// function FrontDeskDashboard() {
//   const [roomFilter, setRoomFilter] = useState("All");
//   const [search, setSearch] = useState("");

//   const filteredRooms = roomsData.filter((room) => {
//     const matchesStatus =
//       roomFilter === "All" || room.status === roomFilter;

//     const matchesSearch =
//       room.number.toLowerCase().includes(search.toLowerCase()) ||
//       room.type.toLowerCase().includes(search.toLowerCase());

//     return matchesStatus && matchesSearch;
//   });

//   return (
//     <div className="frontdesk-dashboard">

//       {/* Header */}

//       <div className="dashboard-header">

//         <div>
//           <h2>Dashboard</h2>

//           <p>
//             Welcome back, Sarah 👋
//           </p>

//           <span>
//             Front Desk • Grand Palace Hotel
//           </span>
//         </div>

//         <div className="header-actions">

//           <button className="notification-btn">
//             <i className="bi bi-bell"></i>
//           </button>

//           <div className="employee-profile">

//             <div className="profile-avatar">
//               S
//             </div>

//             <div>
//               <strong>Sarah</strong>
//               <small>Front Desk</small>
//             </div>

//           </div>

//         </div>

//       </div>


//       {/* Search */}

//       <div className="dashboard-search">

//         <i className="bi bi-search"></i>

//         <input
//           type="text"
//           placeholder="Search guest, reservation or room number..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <button>
//           Search
//         </button>

//       </div>


//       {/* Quick Actions */}

//       <section>

//         <div className="section-title">
//           <h4>Quick Actions</h4>
//         </div>

//         <div className="quick-actions">

//           <button className="quick-action">

//             <div className="action-icon reservation">
//               <i className="bi bi-calendar-plus"></i>
//             </div>

//             <div>
//               <strong>New Reservation</strong>
//               <span>Create a new booking</span>
//             </div>

//           </button>


//           <button className="quick-action">

//             <div className="action-icon checkin">
//               <i className="bi bi-box-arrow-in-right"></i>
//             </div>

//             <div>
//               <strong>Check-In</strong>
//               <span>Check in arriving guest</span>
//             </div>

//           </button>


//           <button className="quick-action">

//             <div className="action-icon checkout">
//               <i className="bi bi-box-arrow-right"></i>
//             </div>

//             <div>
//               <strong>Check-Out</strong>
//               <span>Process guest checkout</span>
//             </div>

//           </button>

//         </div>

//       </section>


//       {/* Overview */}

//       <section>

//         <div className="section-title">
//           <h4>Today's Overview</h4>
//         </div>

//         <div className="overview-grid">

//           <div className="overview-card">

//             <div>
//               <span>Available Rooms</span>
//               <h3>18</h3>
//             </div>

//             <div className="overview-icon available">
//               <i className="bi bi-door-open"></i>
//             </div>

//           </div>


//           <div className="overview-card">

//             <div>
//               <span>Today's Check-Ins</span>
//               <h3>7</h3>
//             </div>

//             <div className="overview-icon checkin">
//               <i className="bi bi-person-plus"></i>
//             </div>

//           </div>


//           <div className="overview-card">

//             <div>
//               <span>Today's Check-Outs</span>
//               <h3>5</h3>
//             </div>

//             <div className="overview-icon checkout">
//               <i className="bi bi-person-dash"></i>
//             </div>

//           </div>


//           <div className="overview-card">

//             <div>
//               <span>Occupied Rooms</span>
//               <h3>22</h3>
//             </div>

//             <div className="overview-icon occupied">
//               <i className="bi bi-building"></i>
//             </div>

//           </div>

//         </div>

//       </section>


//       {/* Check-ins / Check-outs */}

//       <div className="activity-grid">


//         {/* Check-ins */}

//         <div className="dashboard-card">

//           <div className="card-header">

//             <h4>Today's Check-Ins</h4>

//             <button>
//               View All →
//             </button>

//           </div>

//           <div className="activity-list">

//             {checkIns.map((item, index) => (

//               <div
//                 className="activity-item"
//                 key={index}
//               >

//                 <div className="activity-time">
//                   {item.time}
//                 </div>

//                 <div className="activity-info">

//                   <strong>
//                     {item.guest}
//                   </strong>

//                   <span>
//                     Room {item.room} • {item.guests} Guests
//                   </span>

//                 </div>

//                 <button className="checkin-btn">
//                   Check-In
//                 </button>

//               </div>

//             ))}

//           </div>

//         </div>


//         {/* Check-outs */}

//         <div className="dashboard-card">

//           <div className="card-header">

//             <h4>Today's Check-Outs</h4>

//             <button>
//               View All →
//             </button>

//           </div>

//           <div className="activity-list">

//             {checkOuts.map((item, index) => (

//               <div
//                 className="activity-item"
//                 key={index}
//               >

//                 <div className="activity-info">

//                   <strong>
//                     {item.guest}
//                   </strong>

//                   <span>
//                     Room {item.room}
//                   </span>

//                 </div>

//                 <button className="checkout-btn">
//                   Check-Out
//                 </button>

//               </div>

//             ))}

//           </div>

//         </div>

//       </div>


//       {/* Room Status */}

//       <div className="dashboard-card room-section">

//         <div className="card-header">

//           <div>
//             <h4>Room Status</h4>

//             <span>
//               Grand Palace Hotel
//             </span>
//           </div>

//           <button>
//             View All Rooms →
//           </button>

//         </div>


//         {/* Room filters */}

//         <div className="room-filters">

//           {[
//             "All",
//             "Available",
//             "Occupied",
//             "Cleaning",
//             "Maintenance",
//           ].map((filter) => (

//             <button
//               key={filter}
//               className={
//                 roomFilter === filter
//                   ? "active"
//                   : ""
//               }
//               onClick={() => setRoomFilter(filter)}
//             >
//               {filter}
//             </button>

//           ))}

//         </div>


//         {/* Rooms */}

//         <div className="rooms-grid">

//           {filteredRooms.map((room) => (

//             <div
//               className={`room-card ${room.status.toLowerCase()}`}
//               key={room.number}
//             >

//               <div className="room-icon">
//                 <i className="bi bi-door-closed"></i>
//               </div>

//               <h4>
//                 {room.number}
//               </h4>

//               <span>
//                 {room.type}
//               </span>

//               <small>
//                 Floor {room.floor}
//               </small>

//               <strong>
//                 {room.status}
//               </strong>

//             </div>

//           ))}

//         </div>

//       </div>

//     </div>
//   );
// }

// export default FrontDeskDashboard;


import React, { useState } from "react";
import "../styles/FrontDeskDashboard.css";

const roomsData = [
  {
    number: "101",
    type: "Standard",
    floor: 1,
    status: "Available",
  },
  {
    number: "102",
    type: "Standard",
    floor: 1,
    status: "Occupied",
  },
  {
    number: "103",
    type: "Standard",
    floor: 1,
    status: "Cleaning",
  },
  {
    number: "104",
    type: "Deluxe",
    floor: 1,
    status: "Available",
  },
  {
    number: "105",
    type: "Deluxe",
    floor: 1,
    status: "Occupied",
  },
  {
    number: "106",
    type: "Deluxe",
    floor: 1,
    status: "Available",
  },
  {
    number: "201",
    type: "Deluxe",
    floor: 2,
    status: "Available",
  },
  {
    number: "202",
    type: "Family",
    floor: 2,
    status: "Cleaning",
  },
  {
    number: "203",
    type: "Family",
    floor: 2,
    status: "Available",
  },
  {
    number: "204",
    type: "Suite",
    floor: 2,
    status: "Occupied",
  },
  {
    number: "205",
    type: "Suite",
    floor: 2,
    status: "Available",
  },
  {
    number: "301",
    type: "Family",
    floor: 3,
    status: "Available",
  },
  {
    number: "302",
    type: "Family",
    floor: 3,
    status: "Occupied",
  },
  {
    number: "303",
    type: "Suite",
    floor: 3,
    status: "Cleaning",
  },
  {
    number: "304",
    type: "Suite",
    floor: 3,
    status: "Available",
  },
];

const initialCheckIns = [
  {
    time: "09:30 AM",
    guest: "Arun Kumar",
    room: "101",
    guests: 2,
  },
  {
    time: "11:00 AM",
    guest: "Priya Thomas",
    room: "203",
    guests: 3,
  },
  {
    time: "12:30 PM",
    guest: "John Mathew",
    room: "305",
    guests: 2,
  },
];

const initialCheckOuts = [
  {
    guest: "Rahul Kumar",
    room: "102",
    status: "Pending",
  },
  {
    guest: "Maria Joseph",
    room: "201",
    status: "Pending",
  },
  {
    guest: "David John",
    room: "304",
    status: "Pending",
  },
];

const FrontDeskDashboard = () => {
  const [rooms, setRooms] = useState(roomsData);

  const [checkOuts, setCheckOuts] =
    useState(initialCheckOuts);

  const [roomFilter, setRoomFilter] =
    useState("All");

  const [showAllCheckIns, setShowAllCheckIns] =
    useState(false);

  const [showAllCheckOuts, setShowAllCheckOuts] =
    useState(false);

  const [showAllRooms, setShowAllRooms] =
    useState(false);

  const [selectedFloor, setSelectedFloor] =
    useState(1);


  /* =========================
     CHECK-OUT
  ========================= */

  const handleCheckOut = (roomNumber) => {

    // Update checkout status
    setCheckOuts((previous) =>
      previous.map((item) =>
        item.room === roomNumber
          ? {
              ...item,
              status: "Checked Out",
            }
          : item
      )
    );


    // After checkout, room becomes Cleaning
    setRooms((previous) =>
      previous.map((room) =>
        room.number === roomNumber
          ? {
              ...room,
              status: "Cleaning",
            }
          : room
      )
    );
  };


  /* =========================
     ROOM FILTER
  ========================= */

  const filteredRooms = rooms.filter((room) => {

    if (roomFilter === "All") {
      return true;
    }

    return room.status === roomFilter;
  });


  /* =========================
     FLOOR FILTER
  ========================= */

  const floorRooms = rooms.filter(
    (room) =>
      room.floor === selectedFloor
  );


  const floors = [
    ...new Set(
      rooms.map((room) => room.floor)
    ),
  ];


  /* =========================
     ROOM COUNTS
  ========================= */

  const availableRooms = rooms.filter(
    (room) => room.status === "Available"
  ).length;

  const occupiedRooms = rooms.filter(
    (room) => room.status === "Occupied"
  ).length;

  const cleaningRooms = rooms.filter(
    (room) => room.status === "Cleaning"
  ).length;


  return (
    <div className="frontdesk-dashboard">


      {/* =====================================
          HEADER
      ===================================== */}

    <div className="dashboard-header">

  {/* LEFT SIDE */}
  <div className="dashboard-welcome">

    <div className="welcome-icon">
      <i className="bi bi-grid-1x2-fill"></i>
    </div>

    <div className="welcome-content">

      <div className="welcome-title-row">

        <h2>Dashboard</h2>

        <span className="live-badge">
          <span className="live-dot"></span>
          Live
        </span>

      </div>

      <p className="welcome-message">
        Welcome back, <strong>Sarah</strong> 👋
      </p>

      <div className="hotel-info">

        <span className="info-item">
          <i className="bi bi-person-badge"></i>
          Front Desk
        </span>

        <span className="info-divider"></span>

        <span className="info-item hotel-name">
          <i className="bi bi-building"></i>
          Grand Palace Hotel
        </span>

      </div>

    </div>

  </div>


  {/* RIGHT SIDE */}
  <div className="header-actions">

    <div className="header-date">

      <span>Wednesday, Aug 12</span>

      <strong>10:29 AM</strong>

    </div>


    <button className="notification-btn">

      <i className="bi bi-bell"></i>

      <span className="notification-dot"></span>

    </button>


    <div className="employee-profile">

      <div className="profile-avatar">
        S
      </div>

      <div className="employee-details">

        <strong>Sarah</strong>

        <small>Front Desk</small>

      </div>

    </div>

  </div>

</div>



      {/* =====================================
          TODAY'S OVERVIEW
      ===================================== */}

      <section className="overview-section">

        <div className="section-title">

          <div>

            <h4>
              Today's Overview
            </h4>

            <span>
              Grand Palace Hotel
            </span>

          </div>

          <span className="today-label">
            Today
          </span>

        </div>


        <div className="overview-grid">


          {/* Available */}

          <div className="overview-card available-card">

            <div className="overview-content">

              <span><strong>
                Available Rooms</strong>
              </span>

              <h3>
                {availableRooms}
              </h3>

              {/* <small>
                Ready for booking
              </small> */}

            </div>

            <div className="overview-icon">

              <i className="bi bi-door-open"></i>

            </div>

          </div>


          {/* Check-ins */}

          <div className="overview-card checkin-card">

            <div className="overview-content">

              <span><strong>
                Today's Check-Ins</strong>
              </span>

              <h3>
                {initialCheckIns.length}
              </h3>

              {/* <small>
                Guests arriving today
              </small> */}

            </div>

            <div className="overview-icon">

              <i className="bi bi-box-arrow-in-right"></i>

            </div>

          </div>


          {/* Check-outs */}

          <div className="overview-card checkout-card">

            <div className="overview-content">

              <span><strong>
                Pending Check-Outs</strong>
              </span>

              <h3>
                {
                  checkOuts.filter(
                    (item) =>
                      item.status === "Pending"
                  ).length
                }
              </h3>

              {/* <small>
                Pending check-outs
              </small> */}

            </div>

            <div className="overview-icon">

              <i className="bi bi-box-arrow-right"></i>

            </div>

          </div>


          {/* Occupied */}

          <div className="overview-card occupied-card">

            <div className="overview-content">

              <span><strong>
                Occupied Rooms</strong>
              </span>

              <h3>
                {occupiedRooms}
              </h3>

              {/* <small>
                Currently occupied
              </small> */}

            </div>

            <div className="overview-icon">

              <i className="bi bi-person-check"></i>

            </div>

          </div>


        </div>

      </section>



      {/* =====================================
          CHECK-IN / CHECK-OUT
      ===================================== */}

      <div className="activity-grid">


        {/* CHECK-INS */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h4>
                Today's Check-Ins
              </h4>

              <span>
                Guests who checked in today
              </span>

            </div>

            <button
              onClick={() =>
                setShowAllCheckIns(true)
              }
            >
              View All →
            </button>

          </div>


          <div className="activity-list">

            {initialCheckIns
              .slice(0, 3)
              .map((item, index) => (

                <div
                  className="activity-item"
                  key={index}
                >

                  <div className="activity-time">
                    {item.time}
                  </div>


                  <div className="activity-info">

                    <strong>
                      {item.guest}
                    </strong>

                    <span>
                      Room {item.room}
                      {" • "}
                      {item.guests} Guests
                    </span>

                  </div>


                  <span className="completed-badge">
                    Checked In
                  </span>

                </div>

              ))}

          </div>

        </div>



        {/* CHECK-OUTS */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h4>
                Today's Check-Outs
              </h4>

              <span>
                Guests scheduled to leave today
              </span>

            </div>

            <button
              onClick={() =>
                setShowAllCheckOuts(true)
              }
            >
              View All →
            </button>

          </div>


          <div className="activity-list">

            {checkOuts
              .slice(0, 3)
              .map((item, index) => (

                <div
                  className="activity-item"
                  key={index}
                >

                  <div className="activity-info">

                    <strong>
                      {item.guest}
                    </strong>

                    <span>
                      Room {item.room}
                    </span>

                  </div>


                  {item.status === "Pending" ? (

                    <button
                      className="checkout-btn"
                      onClick={() =>
                        handleCheckOut(
                          item.room
                        )
                      }
                    >
                      Check-Out
                    </button>

                  ) : (

                    <span className="completed-badge checkout-completed">
                      Checked Out
                    </span>

                  )}

                </div>

              ))}

          </div>

        </div>

      </div>



      {/* =====================================
          ROOM STATUS
      ===================================== */}

      <div className="dashboard-card room-section">


        <div className="card-header">

          <div>

            <h4>
              Room Status
            </h4>

            <span>
              Current room availability
            </span>

          </div>


          <button
            onClick={() =>
              setShowAllRooms(true)
            }
          >
            View All Rooms →
          </button>

        </div>


        {/* Filters */}

        <div className="room-filters">

          {[
            "All",
            "Available",
            "Occupied",
            "Cleaning",
            "Maintenance",
          ].map((filter) => (

            <button
              key={filter}
              className={
                roomFilter === filter
                  ? "active"
                  : ""
              }
              onClick={() =>
                setRoomFilter(filter)
              }
            >
              {filter}
            </button>

          ))}

        </div>


        {/* Room cards */}

        <div className="rooms-grid">

          {filteredRooms
            .slice(0, 8)
            .map((room) => (

              <div
                className={`room-card ${room.status.toLowerCase()}`}
                key={room.number}
              >

                <div className="room-icon">

                  <i className="bi bi-door-closed"></i>

                </div>


                <h4>
                  {room.number}
                </h4>


                <span>
                  {room.type}
                </span>


                <small>
                  Floor {room.floor}
                </small>


                <strong>
                  {room.status}
                </strong>

              </div>

            ))}

        </div>

      </div>



      {/* =====================================
          CHECK-IN MODAL
      ===================================== */}

      {showAllCheckIns && (

        <div className="modal-overlay">

          <div className="dashboard-modal">

            <div className="modal-header">

              <div>

                <h3>
                  Today's Check-Ins
                </h3>

                <span>
                  All guests who checked in today
                </span>

              </div>

              <button
                onClick={() =>
                  setShowAllCheckIns(false)
                }
              >
                ×
              </button>

            </div>


            <div className="modal-body">

              {initialCheckIns.map(
                (item, index) => (

                  <div
                    className="modal-list-item"
                    key={index}
                  >

                    <div>

                      <strong>
                        {item.guest}
                      </strong>

                      <span>
                        Room {item.room}
                        {" • "}
                        {item.guests} Guests
                      </span>

                    </div>

                    <span className="completed-badge">
                      Checked In
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      )}



      {/* =====================================
          CHECK-OUT MODAL
      ===================================== */}

      {showAllCheckOuts && (

        <div className="modal-overlay">

          <div className="dashboard-modal">

            <div className="modal-header">

              <div>

                <h3>
                  Today's Check-Outs
                </h3>

                <span>
                  All scheduled check-outs
                </span>

              </div>

              <button
                onClick={() =>
                  setShowAllCheckOuts(false)
                }
              >
                ×
              </button>

            </div>


            <div className="modal-body">

              {checkOuts.map(
                (item, index) => (

                  <div
                    className="modal-list-item"
                    key={index}
                  >

                    <div>

                      <strong>
                        {item.guest}
                      </strong>

                      <span>
                        Room {item.room}
                      </span>

                    </div>


                    {item.status ===
                    "Pending" ? (

                      <button
                        className="checkout-btn"
                        onClick={() =>
                          handleCheckOut(
                            item.room
                          )
                        }
                      >
                        Check-Out
                      </button>

                    ) : (

                      <span className="completed-badge checkout-completed">
                        Checked Out
                      </span>

                    )}

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      )}



      {/* =====================================
          ALL ROOMS / FLOOR VIEW
      ===================================== */}

      {showAllRooms && (

        <div className="modal-overlay">

          <div className="rooms-modal">

            <div className="modal-header">

              <div>

                <h3>
                  Room Status
                </h3>

                <span>
                  Grand Palace Hotel
                </span>

              </div>

              <button
                onClick={() =>
                  setShowAllRooms(false)
                }
              >
                ×
              </button>

            </div>


            {/* Floors */}

            <div className="floor-tabs">

              {floors.map((floor) => (

                <button
                  key={floor}
                  className={
                    selectedFloor === floor
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedFloor(floor)
                  }
                >

                  Floor {floor}

                </button>

              ))}

            </div>


            {/* Selected Floor */}

            <div className="floor-title">

              <h4>
                Floor {selectedFloor}
              </h4>

              <span>
                {
                  floorRooms.length
                }{" "}
                Rooms
              </span>

            </div>


            <div className="rooms-grid all-room-grid">

              {floorRooms.map(
                (room) => (

                  <div
                    className={`room-card ${room.status.toLowerCase()}`}
                    key={room.number}
                  >

                    <div className="room-icon">

                      <i className="bi bi-door-closed"></i>

                    </div>

                    <h4>
                      {room.number}
                    </h4>

                    <span>
                      {room.type}
                    </span>

                    <strong>
                      {room.status}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default FrontDeskDashboard;