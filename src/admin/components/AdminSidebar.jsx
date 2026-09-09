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


  const goTo = (path) => {

    navigate(path);

  };


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


      {/* BRAND */}

      <div>

        <div className="admin-sidebar-brand">
          FALDREN
        </div>

        <span className="admin-sidebar-label">
          ADMIN
        </span>

      </div>



      {/* MAIN NAVIGATION */}

      <nav className="admin-sidebar-nav">


        <button
          className={
            `admin-nav-item ${
              isActive("/admin/dashboard")
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            goTo("/admin/dashboard")
          }
        >

          <LayoutDashboard size={18} />

          <span>
            Overview
          </span>

        </button>



        <button
          className={
            `admin-nav-item ${
              isActive("/admin/clients")
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            goTo("/admin/clients")
          }
        >

          <Users size={18} />

          <span>
            Clients
          </span>

        </button>



        <button
          className={
            `admin-nav-item ${
              isActive("/admin/projects")
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            goTo("/admin/projects")
          }
        >

          <FolderKanban size={18} />

          <span>
            Projects
          </span>

        </button>



        <button
          className={
            `admin-nav-item ${
              isActive("/admin/requests")
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            goTo("/admin/requests")
          }
        >

          <Inbox size={18} />

          <span>
            Requests
          </span>

        </button>

      </nav>



      {/* BOTTOM */}

      <div className="admin-sidebar-bottom">

        <button
          className="admin-nav-item"
        >

          <Settings size={18} />

          <span>
            Settings
          </span>

        </button>


        <button
          className="admin-nav-item"
          onClick={handleLogout}
        >

          <LogOut size={18} />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}

export default AdminSidebar;