import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "./MainLayout.css";
import Topbar from "../components/Topbar/Topbar";

const MainLayout = () => {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-wrapper">
        <Topbar />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
    </div>
  );
};

export default MainLayout;