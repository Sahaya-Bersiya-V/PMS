import { useEffect, useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import "./Topbar.css";

const Topbar = () => {
  const location = useLocation();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pageTitle = location.pathname
    .split("/")
    .filter(Boolean)
    .join(" ")
    .replace("-", " ");

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2>{pageTitle || "Dashboard"}</h2>
        <p>
          Welcome back,<strong>Admin</strong>👋🏻
        </p>
      </div>

      <div className="topbar-right">
        <div className="date-time">
          <p>
            {currentTime.toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>

          <span>{currentTime.toLocaleTimeString()}</span>
        </div>

        <button className="notification-btn">
          <FaBell />
        </button>

        <div className="user-profile">
          <FaUserCircle className="user-icon" />

          <div>
            <h4>Admin</h4>
            <p>Hotel Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;