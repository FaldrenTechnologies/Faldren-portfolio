import React, {
  useEffect,
  useState
} from "react";

import {
  ArrowUpRight,
  Users,
  FolderKanban,
  Inbox,
  CheckCircle2
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import "../admin.css";


const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");


function AdminDashboard() {

  const navigate =
    useNavigate();


  const [projects, setProjects] =
    useState([]);

  const [requests, setRequests] =
    useState([]);

  const [clients, setClients] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const adminName =
    localStorage.getItem(
      "adminName"
    ) || "Administrator";


  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  const loadDashboard =
    async () => {

      const token =
        localStorage.getItem(
          "adminToken"
        );


      if (!token) {

        window.location.href =
          "/admin/login";

        return;
      }


      try {

        setLoading(true);
        setError("");


        const [
          projectResponse,
          requestResponse,
          clientResponse
        ] =
          await Promise.all([

            fetch(
              `${API_BASE}/api/admin/projects`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            ),

            fetch(
              `${API_BASE}/api/admin/project-requests`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            ),

            fetch(
              `${API_BASE}/api/admin/clients`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            )

          ]);


        if (
          projectResponse.status === 401 ||
          projectResponse.status === 403 ||
          requestResponse.status === 401 ||
          requestResponse.status === 403 ||
          clientResponse.status === 401 ||
          clientResponse.status === 403
        ) {

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


          window.location.href =
            "/admin/login";

          return;
        }


        const projectData =
          await projectResponse.json();

        const requestData =
          await requestResponse.json();

        const clientData =
          await clientResponse.json();


        if (!projectResponse.ok) {

          throw new Error(
            projectData.message ||
            "Unable to load projects."
          );
        }


        if (!requestResponse.ok) {

          throw new Error(
            requestData.message ||
            "Unable to load requests."
          );
        }


        if (!clientResponse.ok) {

          throw new Error(
            clientData.message ||
            "Unable to load clients."
          );
        }


        setProjects(
          Array.isArray(projectData)
            ? projectData
            : []
        );


        setRequests(
          Array.isArray(requestData)
            ? requestData
            : []
        );


        setClients(
          Array.isArray(clientData)
            ? clientData
            : []
        );


      } catch (error) {

        console.error(
          "Dashboard loading error:",
          error
        );


        setError(
          error.message ||
          "Unable to load dashboard."
        );


      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    loadDashboard();


    const refreshDashboard = () => {
      loadDashboard();
    };


    const handleVisibilityChange = () => {

      if (
        document.visibilityState ===
        "visible"
      ) {

        loadDashboard();
      }

    };


    window.addEventListener(
      "focus",
      refreshDashboard
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );


    return () => {

      window.removeEventListener(
        "focus",
        refreshDashboard
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };

  }, []);


  // ==========================================
  // DASHBOARD CALCULATIONS
  // ==========================================

  const activeProjects =
    projects.filter(
      project =>
        project.status !==
          "COMPLETED"
    );


  const completedProjects =
    projects.filter(
      project =>
        project.status ===
          "COMPLETED"
    );


  const pendingRequests =
    requests.filter(
      request =>
        request.status ===
          "PENDING"
    );


  // ==========================================
  // REAL CLIENT COUNT
  // ==========================================

  const totalClients =
    clients.length;


  const stats = [

    {
      label: "Total Clients",
      value: totalClients,
      icon: Users
    },

    {
      label: "Active Projects",
      value:
        activeProjects.length,
      icon: FolderKanban
    },

    {
      label: "New Requests",
      value:
        pendingRequests.length,
      icon: Inbox
    },

    {
      label: "Completed",
      value:
        completedProjects.length,
      icon: CheckCircle2
    }

  ];


  const recentProjects =
    [...projects]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt || 0
          ) -
          new Date(
            a.createdAt || 0
          )
      )
      .slice(
        0,
        4
      );


  const latestRequests =
    [...requests]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt || 0
          ) -
          new Date(
            a.createdAt || 0
          )
      )
      .slice(
        0,
        4
      );


  // ==========================================
  // HELPERS
  // ==========================================

  const formatStatus =
    status =>
      (
        status ||
        ""
      ).replaceAll(
        "_",
        " "
      );


  const formatDate =
    value => {

      if (!value) {
        return "—";
      }


      const date =
        new Date(value);


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return value;

      }


      return date
        .toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }
        );

    };


  return (

    <div className="admin-dashboard">

      <AdminSidebar />


      <main className="admin-main">


        {/* ================= TOPBAR ================= */}

        <header className="admin-topbar">

          <div>

            <span className="admin-page-label">
              FALDREN / ADMIN
            </span>

            <h1>
              Overview
            </h1>

          </div>


          <div className="admin-profile">

            <div className="admin-profile-copy">

              <strong>
                {adminName}
              </strong>

              <span>
                FALDREN
              </span>

            </div>


            <div className="admin-avatar">

              {adminName
                .charAt(0)
                .toUpperCase()}

            </div>

          </div>

        </header>



        {/* ================= WELCOME ================= */}

        <section className="admin-welcome">

          <div>

            <span>
              WORKSPACE
            </span>

            <h2>
              Good to see you.
            </h2>

            <p>
              Here's what's happening
              across FALDREN.
            </p>

          </div>


          <span className="admin-welcome-index">
            01 / OVERVIEW
          </span>

        </section>



        {/* ================= ERROR ================= */}

        {error && (

          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              border:
                "1px solid rgba(130, 74, 60, .25)",
              color: "#7c463b"
            }}
          >
            {error}
          </div>

        )}



        {/* ================= STATS ================= */}

        <section className="admin-stats">

          {stats.map(
            stat => {

              const Icon =
                stat.icon;


              return (

                <article
                  className="admin-stat-card"
                  key={stat.label}
                >

                  <div className="admin-stat-top">

                    <span>
                      {stat.label}
                    </span>

                    <Icon
                      size={18}
                      strokeWidth={1.6}
                    />

                  </div>


                  <strong>

                    {loading
                      ? "—"
                      : String(
                          stat.value
                        ).padStart(
                          2,
                          "0"
                        )}

                  </strong>

                </article>

              );

            }
          )}

        </section>



        {/* ================= BOTTOM GRID ================= */}

        <section className="admin-dashboard-grid">


          {/* =====================================
              RECENT PROJECTS
          ===================================== */}

          <div className="admin-recent-projects">

            <div className="admin-section-head">

              <div>

                <span>
                  PROJECTS
                </span>

                <h3>
                  Recent projects
                </h3>

              </div>


              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/projects"
                  )
                }
              >

                View all

                <ArrowUpRight
                  size={16}
                />

              </button>

            </div>



            {loading ? (

              <div className="admin-empty-state">

                <span>
                  ...
                </span>

                <h4>
                  Loading projects.
                </h4>

              </div>

            ) : recentProjects.length ===
              0 ? (

              <div className="admin-empty-state">

                <span>
                  00
                </span>

                <h4>
                  No projects yet.
                </h4>

                <p>
                  Accepted projects will
                  appear here.
                </p>

              </div>

            ) : (

              <div
                style={{
                  display: "grid",
                  gap: "1px",
                  background:
                    "rgba(20, 20, 20, 0.08)"
                }}
              >

                {recentProjects.map(
                  project => (

                    <button
                      key={project.id}
                      type="button"
                      onClick={() =>
                        navigate(
                          "/admin/projects"
                        )
                      }
                      style={{
                        width: "100%",
                        border: "0",
                        background: "#fff",
                        padding:
                          "20px 22px",
                        display: "grid",
                        gridTemplateColumns:
                          "1fr auto",
                        gap: "20px",
                        textAlign: "left",
                        cursor: "pointer"
                      }}
                    >

                      <div>

                        <span
                          style={{
                            display: "block",
                            fontSize: "10px",
                            letterSpacing:
                              "0.12em",
                            marginBottom:
                              "7px",
                            opacity: 0.55
                          }}
                        >

                          {project
                            .serviceType ||
                            "PROJECT"}

                          {" / "}

                          {formatStatus(
                            project.status
                          )}

                        </span>


                        <strong
                          style={{
                            display: "block",
                            fontSize: "16px",
                            marginBottom:
                              "5px"
                          }}
                        >

                          {project.title}

                        </strong>


                        <span
                          style={{
                            fontSize: "12px",
                            opacity: 0.6
                          }}
                        >

                          {project
                            .clientCompany ||
                            project
                              .clientFullName ||
                            "Client"}

                          {" · Due "}

                          {formatDate(
                            project.dueDate
                          )}

                        </span>

                      </div>


                      <strong
                        style={{
                          fontSize: "14px"
                        }}
                      >

                        {project.progress ??
                          0}%

                      </strong>

                    </button>

                  )
                )}

              </div>

            )}

          </div>



          {/* =====================================
              LATEST ACTIVITY
          ===================================== */}

          <aside className="admin-activity">

            <div className="admin-section-head">

              <div>

                <span>
                  ACTIVITY
                </span>

                <h3>
                  Latest
                </h3>

              </div>

            </div>



            {loading ? (

              <div className="admin-empty-activity">

                <div className="admin-activity-dot" />

                <div>

                  <strong>
                    Loading activity
                  </strong>

                  <p>
                    Fetching latest updates.
                  </p>

                </div>

              </div>

            ) : latestRequests.length ===
              0 ? (

              <div className="admin-empty-activity">

                <div className="admin-activity-dot" />

                <div>

                  <strong>
                    Workspace ready
                  </strong>

                  <p>
                    Activity will appear
                    when clients submit
                    project requests.
                  </p>

                </div>

              </div>

            ) : (

              <div>

                {latestRequests.map(
                  request => (

                    <button
                      key={request.id}
                      type="button"
                      onClick={() =>
                        navigate(
                          "/admin/requests"
                        )
                      }
                      style={{
                        width: "100%",
                        border: "0",
                        borderTop:
                          "1px solid rgba(20,20,20,.08)",
                        background:
                          "transparent",
                        padding:
                          "18px 0",
                        textAlign:
                          "left",
                        cursor:
                          "pointer",
                        display:
                          "grid",
                        gridTemplateColumns:
                          "10px 1fr",
                        gap: "13px"
                      }}
                    >

                      <div
                        className="admin-activity-dot"
                        style={{
                          marginTop:
                            "6px"
                        }}
                      />


                      <div>

                        <strong
                          style={{
                            display:
                              "block",
                            marginBottom:
                              "5px"
                          }}
                        >

                          {
                            request
                              .clientFullName
                          }

                        </strong>


                        <p
                          style={{
                            margin:
                              "0 0 5px"
                          }}
                        >

                          {request.status ===
                          "PENDING"
                            ? "Submitted a new project request"
                            : request.status ===
                              "ACCEPTED"
                              ? "Project request accepted"
                              : "Project request rejected"}

                        </p>


                        <span
                          style={{
                            fontSize:
                              "11px",
                            opacity:
                              0.55
                          }}
                        >

                          {
                            request
                              .projectName
                          }

                          {" · "}

                          {formatDate(
                            request.createdAt
                          )}

                        </span>

                      </div>

                    </button>

                  )
                )}

              </div>

            )}

          </aside>

        </section>

      </main>

    </div>

  );

}


export default AdminDashboard;