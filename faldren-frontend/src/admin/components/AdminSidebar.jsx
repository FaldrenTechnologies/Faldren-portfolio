import React from "react";

import {
  LayoutDashboard,
  Users,
  UserCog,
  FolderKanban,
  Inbox,
  Settings,
  GitPullRequest,
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

    return (
      location.pathname === path ||
      location.pathname.startsWith(
        `${path}/`
      )
    );

  };


  const handleLogout = () => {

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminName"
    );

    localStorage.removeItem(
      "adminEmail"
    );

    localStorage.removeItem(
      "adminRole"
    );

    localStorage.removeItem(
      "adminLoggedIn"
    );


    navigate(
      "/admin/login",
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
          ADMIN
        </span>

      </div>



      <nav className="admin-sidebar-nav">


        {/* OVERVIEW */}

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



        {/* CLIENTS */}

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



        {/* DEVELOPERS */}

        <button
          type="button"
          className={
            `admin-nav-item ${
              isActive(
                "/admin/developers"
              )
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            navigate(
              "/admin/developers"
            )
          }
        >

          <UserCog
            size={18}
          />

          <span>
            Developers
          </span>

        </button>



        {/* PROJECTS */}

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



        {/* REVIEWS */}

        <button
          type="button"
          className={
            `admin-nav-item ${
              isActive(
                "/admin/reviews"
              )
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            navigate(
              "/admin/reviews"
            )
          }
        >

          <GitPullRequest
            size={18}
          />

          <span>
            Reviews
          </span>

        </button>



        {/* REQUESTS */}

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