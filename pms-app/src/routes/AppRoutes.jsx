// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import MainLayout from "../layouts/MainLayout";

// // import Dashboard from "../pages/Dashboard/Dashboard";
// import RoomsOverview from "../pages/RoomsOverview/RoomsOverview";
// import Reservations from "../pages/Reservations/Reservations";
// import Guests from "../pages/Guests/Guests";
// import Rooms from "../pages/Rooms/Rooms";
// import RoomTypes from "../pages/RoomTypes/RoomTypes";
// import Staffs from "../pages/Staffs/Staffs";
// import Roles from "../pages/Roles/Roles";
// import Reports from "../pages/Reports/Reports";
// import Expenses from "../pages/Expenses/Expenses";
// import Settings from "../pages/Settings/Settings";
// import Dashboard from "../pages/Dashboard/Dashboard";
// import FrontDeskLogin from "../pages/FrontDeskLogin/FrontDeskLogin";

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<MainLayout />}>
//         <Route
//     path="/frontdesk/login"
//     element={<FrontDeskLogin />}
// />
//           <Route path="/" element={<Dashboard />} />
//           {/* <Route path="/rooms-overview" element={<RoomsOverview />} /> */}
//           <Route path="/reservations" element={<Reservations />} />
//           <Route path="/guests" element={<Guests />} />
//           <Route path="/rooms" element={<Rooms />} />
//           <Route path="/room-types" element={<RoomTypes />} />
//           {/* <Route path="/staffs" element={<Staffs />} /> */}
//           {/* <Route path="/roles" element={<Roles />} /> */}
//           {/* <Route path="/reports" element={<Reports />} /> */}
//           {/* <Route path="/expenses" element={<Expenses />} /> */}
//           {/* <Route path="/settings" element={<Settings />} /> */}
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default AppRoutes;


// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import MainLayout from "../layouts/MainLayout";

// import Reservations from "../pages/Reservations/Reservations";
// import Guests from "../pages/Guests/Guests";
// import Rooms from "../pages/Rooms/Rooms";
// import RoomTypes from "../pages/RoomTypes/RoomTypes";
// import Dashboard from "../pages/Dashboard/Dashboard";

// import FrontDeskLogin from "../pages/FrontDeskLogin/FrontDeskLogin";

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>

//       <Routes>

//         {/* =========================================
//             FRONT DESK LOGIN
//             No Sidebar / No MainLayout
//         ========================================= */}

//         <Route
//           path="/frontdesk/login"
//           element={<FrontDeskLogin />}
//         />


//         {/* =========================================
//             MAIN PMS APPLICATION
//             Sidebar + MainLayout
//         ========================================= */}

//         <Route element={<MainLayout />}>

//           <Route
//             path="/frontdesk"
//             element={<Dashboard />}
//           />

//           <Route
//             path="/reservations"
//             element={<Reservations />}
//           />

//           <Route
//             path="/guests"
//             element={<Guests />}
//           />

//           <Route
//             path="/rooms"
//             element={<Rooms />}
//           />

//           <Route
//             path="/room-types"
//             element={<RoomTypes />}
//           />

//         </Route>

//       </Routes>

//     </BrowserRouter>
//   );
// };

// export default AppRoutes;


import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Reservations from "../pages/Reservations/Reservations";
import Guests from "../pages/Guests/Guests";
import Rooms from "../pages/Rooms/Rooms";
import RoomTypes from "../pages/RoomTypes/RoomTypes";
import Dashboard from "../pages/Dashboard/Dashboard";

import FrontDeskLogin from "../pages/FrontDeskLogin/FrontDeskLogin";


const AppRoutes = () => {

  return (

    <BrowserRouter>

      <Routes>

        {/* =====================================
            FRONT DESK LOGIN
            No MainLayout / No Sidebar
        ====================================== */}

        <Route
          path="/frontdesk/login"
          element={<FrontDeskLogin />}
        />


        {/* =====================================
            MAIN PMS APPLICATION
        ====================================== */}

        <Route element={<MainLayout />}>
          <Route
           path="/frontdesk"
          element={<Dashboard />}
       /> 
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/reservations"
            element={<Reservations />}
          />

          <Route
            path="/guests"
            element={<Guests />}
          />

          <Route
            path="/rooms"
            element={<Rooms />}
          />

          <Route
            path="/room-types"
            element={<RoomTypes />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
};


export default AppRoutes;