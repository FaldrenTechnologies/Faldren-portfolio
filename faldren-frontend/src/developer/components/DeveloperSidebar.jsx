import React from "react";

import {
  LayoutDashboard,
  ListTodo,
  LogOut
} from "lucide-react";

import {
  NavLink,
  useNavigate
} from "react-router-dom";

import "../../admin/admin.css";


function DeveloperSidebar() {

  const navigate =
    useNavigate();


  const handleLogout = () => {

    localStorage.removeItem(
      "developerToken"
    );

    localStorage.removeItem(
      "developerName"
    );

    localStorage.removeItem(
      "developerEmail"
    );

    localStorage.removeItem(
      "developerRole"
    );

    localStorage.removeItem(
      "developerMustChangePassword"
    );


    navigate(
      "/developer/login",
      {
        replace: true
      }
    );
  };


  return (

    <aside className="admin-sidebar">

      <div>

        <div className="admin-sidebar-brand">
          FALDREN
        </div>

        <span className="admin-sidebar-label">
          DEVELOPER
        </span>

      </div>


      <nav className="admin-sidebar-nav">

        <NavLink
          to="/developer/dashboard"
          className={({ isActive }) =>
            `admin-nav-item ${
              isActive
                ? "active"
                : ""
            }`
          }
        >

          <LayoutDashboard
            size={18}
          />

          <span>
            Dashboard
          </span>

        </NavLink>


        <NavLink
          to="/developer/tasks"
          className={({ isActive }) =>
            `admin-nav-item ${
              isActive
                ? "active"
                : ""
            }`
          }
        >

          <ListTodo
            size={18}
          />

          <span>
            My Tasks
          </span>

        </NavLink>

      </nav>


      <div className="admin-sidebar-bottom">

        <button
          type="button"
          className="admin-nav-item"
          onClick={
            handleLogout
          }
        >

          <LogOut
            size={18}
          />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>

  );
}


export default DeveloperSidebar;