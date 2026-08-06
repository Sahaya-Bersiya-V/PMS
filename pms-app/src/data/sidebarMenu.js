// import {
//   MdDashboard,
//   MdOutlineMeetingRoom,
//   MdEventAvailable,
//   MdAdminPanelSettings,
// } from "react-icons/md";

// import {
//   FaUsers,
//   FaBed,
//   FaHotel,
//   FaUserTie,
//   FaChartBar,
//   FaMoneyBillWave,
// } from "react-icons/fa";

// import { IoSettingsSharp } from "react-icons/io5";

// const sidebarMenu = [
//   {
//     title: "Main",
//     items: [
//       {
//         name: "Dashboard",
//         path: "/",
//         icon: MdDashboard,
//       },
//     ],
//   },

//   {
//     title: "Property Management",
//     items: [
//       {
//         name: "Rooms Overview",
//         path: "/rooms-overview",
//         icon: MdOutlineMeetingRoom,
//       },
//       {
//         name: "Rooms",
//         path: "/rooms",
//         icon: FaBed,
//       },
//       {
//         name: "Room Types",
//         path: "/room-types",
//         icon: FaHotel,
//       },
//     ],
//   },

//   {
//     title: "Operations",
//     items: [
//       {
//         name: "Reservations",
//         path: "/reservations",
//         icon: MdEventAvailable,
//       },
//       {
//         name: "Guests",
//         path: "/guests",
//         icon: FaUsers,
//       },
//     ],
//   },

//   {
//     title: "Administration",
//     items: [
//       {
//         name: "Staffs",
//         path: "/staffs",
//         icon: FaUserTie,
//       },
//       {
//         name: "Roles",
//         path: "/roles",
//         icon: MdAdminPanelSettings ,
//       },
//     ],
//   },

//   {
//     title: "Finance",
//     items: [
//       {
//         name: "Expenses",
//         path: "/expenses",
//         icon: FaMoneyBillWave,
//       },
//       {
//         name: "Reports",
//         path: "/reports",
//         icon: FaChartBar ,
//       },
//     ],
//   },

//   {
//     title: "Settings",
//     items: [
//       {
//         name: "Settings",
//         path: "/settings",
//         icon: IoSettingsSharp ,
//       },
//     ],
//   },
// ];

// export default sidebarMenu;

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
      // {
      //   name: "Rooms Overview",
      //   path: "/rooms-overview",
      //   icon: MdOutlineMeetingRoom,
      // },
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
      // {
      //   name: "Staffs",
      //   path: "/staffs",
      //   icon: FaUserTie,
      // },
      // {
      //   name: "Roles",
      //   path: "/roles",
      //   icon: MdAdminPanelSettings ,
      // },
      //  {
      //   name: "Expenses",
      //   path: "/expenses",
      //   icon: FaMoneyBillWave,
      // },
      // {
      //   name: "Reports",
      //   path: "/reports",
      //   icon: FaChartBar ,
      // },
      //  {
      //   name: "Settings",
      //   path: "/settings",
      //   icon: IoSettingsSharp ,
      // },
    ],
  },

 
 


];

export default sidebarMenu;