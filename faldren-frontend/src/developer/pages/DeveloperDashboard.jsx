import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  FolderKanban,
  GitBranch,
  ClipboardCheck,
  Clock3,
  ArrowRight
} from "lucide-react";

import {
  useNavigate
} from "react-router-dom";

import DeveloperSidebar
  from "../components/DeveloperSidebar";

import "../../admin/admin.css";


const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");


function DeveloperDashboard() {

  const navigate =
    useNavigate();


  const [modules, setModules] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const developerName =
    localStorage.getItem(
      "developerName"
    ) || "Developer";


  // ==========================================
  // LOAD MODULES FOR COUNTS ONLY
  // ==========================================

  useEffect(() => {

    const loadModules =
      async () => {

        const token =
          localStorage.getItem(
            "developerToken"
          );


        if (!token) {

          navigate(
            "/developer/login",
            {
              replace: true
            }
          );

          return;
        }


        try {

          setLoading(true);

          setError("");


          const response =
            await fetch(
              `${API_BASE}/api/developer/modules`,
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );


          if (
            response.status === 401 ||
            response.status === 403
          ) {

            localStorage.removeItem(
              "developerToken"
            );

            navigate(
              "/developer/login",
              {
                replace: true
              }
            );

            return;
          }


          const data =
            await response.json();


          if (!response.ok) {

            setError(
              data.message ||
              "Unable to load dashboard."
            );

            return;
          }


          setModules(
            Array.isArray(data)
              ? data
              : []
          );


        } catch (error) {

          console.error(
            "Dashboard loading error:",
            error
          );


          setError(
            "Unable to connect to backend."
          );


        } finally {

          setLoading(false);

        }

      };


    loadModules();

  }, [navigate]);


  // ==========================================
  // REAL COUNTS
  // ==========================================

  const stats =
    useMemo(() => {

      return {

        assigned:
          modules.length,

        inProgress:
          modules.filter(
            module =>
              module.status ===
              "IN_PROGRESS"
          ).length,

        inReview:
          modules.filter(
            module =>
              module.status ===
              "IN_REVIEW"
          ).length,

        completed:
          modules.filter(
            module =>
              module.status ===
              "COMPLETED"
          ).length

      };

    }, [modules]);


  return (

    <div className="admin-dashboard developer-portal">


      {/* ======================================
          COMMON DEVELOPER SIDEBAR
      ====================================== */}

      <DeveloperSidebar />


      <main className="admin-main">


        {/* ======================================
            TOP BAR
        ====================================== */}

        <header className="admin-topbar">

          <div>

            <span className="admin-page-label">
              FALDREN / DEVELOPER
            </span>

            <h1>
              Dashboard
            </h1>

          </div>


          <div className="admin-profile">

            <div className="admin-profile-copy">

              <strong>
                {developerName}
              </strong>

              <span>
                DEVELOPER
              </span>

            </div>


            <div className="admin-avatar">

              {developerName
                .charAt(0)
                .toUpperCase()}

            </div>

          </div>

        </header>


        {/* ======================================
            INTRO
        ====================================== */}

        <section className="admin-clients-intro">

          <div>

            <span className="admin-clients-kicker">
              DEVELOPMENT WORKSPACE
            </span>


            <h2>

              Welcome,
              <br />

              {developerName}.

            </h2>


            <p>

              Track your current workload,
              development progress and
              review status.

            </p>

          </div>

        </section>


        {/* ======================================
            ERROR
        ====================================== */}

        {error && (

          <div className="admin-project-api-error">

            {error}

          </div>

        )}


       {/* ======================================
    STATS
====================================== */}

<section className="developer-stats">

  <div className="developer-stat-card">

    <div className="developer-stat-head">
      <span>ASSIGNED MODULES</span>

      <FolderKanban size={20} />
    </div>

    <strong>
      {loading
        ? "--"
        : String(
            stats.assigned
          ).padStart(2, "0")}
    </strong>

  </div>


  <div className="developer-stat-card">

    <div className="developer-stat-head">
      <span>IN PROGRESS</span>

      <Clock3 size={20} />
    </div>

    <strong>
      {loading
        ? "--"
        : String(
            stats.inProgress
          ).padStart(2, "0")}
    </strong>

  </div>


  <div className="developer-stat-card">

    <div className="developer-stat-head">
      <span>IN REVIEW</span>

      <GitBranch size={20} />
    </div>

    <strong>
      {loading
        ? "--"
        : String(
            stats.inReview
          ).padStart(2, "0")}
    </strong>

  </div>


  <div className="developer-stat-card">

    <div className="developer-stat-head">
      <span>COMPLETED</span>

      <ClipboardCheck size={20} />
    </div>

    <strong>
      {loading
        ? "--"
        : String(
            stats.completed
          ).padStart(2, "0")}
    </strong>

  </div>

</section>


        {/* ======================================
            TASK SHORTCUT
        ====================================== */}

        <section
          style={{
            marginTop: "38px",
            padding: "26px",
            border:
              "1px solid rgba(25, 25, 22, 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: "20px"
          }}
        >

          <div>

            <span className="admin-clients-kicker">
              MY WORK
            </span>

            <h3
              style={{
                margin:
                  "8px 0 6px",
                fontSize: "22px",
                fontWeight: 500
              }}
            >

              Manage your assigned tasks

            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "12px",
                opacity: 0.62
              }}
            >

              Start development,
              check branches and submit
              modules for review.

            </p>

          </div>


          <button
            type="button"
            className="developer-start-work-btn"
            onClick={() =>
              navigate(
                "/developer/tasks"
              )
            }
          >

            My Tasks

            <ArrowRight
              size={14}
            />

          </button>

        </section>


      </main>

    </div>

  );

}


export default DeveloperDashboard;