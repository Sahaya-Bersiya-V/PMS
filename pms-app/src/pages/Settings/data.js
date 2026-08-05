import {
    FaHotel,
    FaMoneyBillWave,
    FaCreditCard,
    FaDoorOpen,
    FaFileInvoiceDollar,
    FaEnvelope,
    FaBell,
    FaShieldAlt,
    FaDatabase,
    FaCog,
} from "react-icons/fa";

const settingsCards = [

    {
        id:1,
        title:"Hotel Information",
        description:"Hotel details & branding",
        icon:FaHotel,
        color:"#2563eb"
    },

    {
        id:2,
        title:"Tax & Currency",
        description:"GST and Currency",
        icon:FaMoneyBillWave,
        color:"#10b981"
    },

    {
        id:3,
        title:"Payment Methods",
        description:"Cash, Card & UPI",
        icon:FaCreditCard,
        color:"#f59e0b"
    },

    {
        id:4,
        title:"Room Policies",
        description:"Check-in / Check-out",
        icon:FaDoorOpen,
        color:"#8b5cf6"
    },

    {
        id:5,
        title:"Invoice Settings",
        description:"Invoice Configuration",
        icon:FaFileInvoiceDollar,
        color:"#ef4444"
    },

    {
        id:6,
        title:"Email & SMS",
        description:"SMTP Configuration",
        icon:FaEnvelope,
        color:"#06b6d4"
    },

    {
        id:7,
        title:"Notifications",
        description:"Alerts & Reminders",
        icon:FaBell,
        color:"#eab308"
    },

    {
        id:8,
        title:"Security",
        description:"Password & Sessions",
        icon:FaShieldAlt,
        color:"#dc2626"
    },

    {
        id:9,
        title:"Backup",
        description:"Backup & Restore",
        icon:FaDatabase,
        color:"#0ea5e9"
    },

    {
        id:10,
        title:"Preferences",
        description:"Theme & Language",
        icon:FaCog,
        color:"#64748b"
    }

];

export default settingsCards;