

import { BrowserRouter, Routes, Route } from "react-router-dom";
import FrontDeskProtectedRoute
    from "./FrontDeskProtectedRoute";
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
    element={
        <FrontDeskProtectedRoute>
            <Dashboard />
        </FrontDeskProtectedRoute>
    }
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