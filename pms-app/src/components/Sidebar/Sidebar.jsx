import { NavLink } from "react-router-dom";
import sidebarMenu from "../../data/sidebarMenu";

import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <img src="/logo.jpg" alt="Logo" />
        <div>
          <h2>PMS</h2>
          <p>Hotel Management</p>
        </div>
      </div>

      <nav className="sidebar-nav">
  {sidebarMenu.map((section) => (
    <div key={section.title} className="menu-section">
      {/* <h5>{section.title}</h5> */}

      {section.items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <span className="icon">
              <Icon />
            </span>

            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </div>
  ))}
</nav>

    </aside>
  );
};

export default Sidebar;