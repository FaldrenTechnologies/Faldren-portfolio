import React from "react";

import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Inbox,
  Settings,
  LogOut
} from "lucide-react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";


function AdminSidebar() {

  const navigate = useNavigate();

  const location = useLocation();


  const isActive = (path) => {
    return location.pathname === path;
  };


  const handleLogout = () => {

    localStorage.removeItem(
      "adminLoggedIn"
    );

    navigate("/admin/login");

  };


  return (

    <aside className="admin-sidebar">


      <div>

        <div className="admin-sidebar-brand">
          FALDREN
        </div>

        <span className="admin-sidebar-label">
          ADMIN
        </span>

      </div>



      <nav className="admin-sidebar-nav">


        <button
          type="button"
          className={
            `admin-nav-item ${
              isActive(
                "/admin/dashboard"
              )
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >

          <LayoutDashboard
            size={18}
          />

          <span>
            Overview
          </span>

        </button>



        <button
          type="button"
          className={
            `admin-nav-item ${
              isActive(
                "/admin/clients"
              )
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            navigate(
              "/admin/clients"
            )
          }
        >

          <Users
            size={18}
          />

          <span>
            Clients
          </span>

        </button>



        <button
          type="button"
          className={
            `admin-nav-item ${
              isActive(
                "/admin/projects"
              )
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            navigate(
              "/admin/projects"
            )
          }
        >

          <FolderKanban
            size={18}
          />

          <span>
            Projects
          </span>

        </button>



        <button
          type="button"
          className={
            `admin-nav-item ${
              isActive(
                "/admin/requests"
              )
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            navigate(
              "/admin/requests"
            )
          }
        >

          <Inbox
            size={18}
          />

          <span>
            Requests
          </span>

        </button>

      </nav>



      <div className="admin-sidebar-bottom">

        <button
          type="button"
          className="admin-nav-item"
        >

          <Settings
            size={18}
          />

          <span>
            Settings
          </span>

        </button>


        <button
          type="button"
          className="admin-nav-item"
          onClick={handleLogout}
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

export default AdminSidebar;