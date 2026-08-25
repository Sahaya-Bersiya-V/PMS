
import {
  MdDashboard,
  MdOutlineMeetingRoom,
  MdEventAvailable,
  MdAdminPanelSettings,
} from "react-icons/md";

import {
  FaUsers,
  FaBed,
  FaHotel,
  FaUserTie,
  FaChartBar,
  FaMoneyBillWave,
} from "react-icons/fa";

import { IoSettingsSharp } from "react-icons/io5";

const sidebarMenu = [
  {
    
    items: [
      {
        name: "Dashboard",
        path: "/",
        icon: MdDashboard,
      },
    
      {
        name: "Reservations",
        path: "/reservations",
        icon: MdEventAvailable,
      },
      {
        name: "Rooms",
        path: "/rooms",
        icon: FaBed,
      },
      {
        name: "Room Types",
        path: "/room-types",
        icon: FaHotel,
      },
       
      {
        name: "Guests",
        path: "/guests",
        icon: FaUsers,
      },

    ],
  },

 
 


];

export default sidebarMenu;