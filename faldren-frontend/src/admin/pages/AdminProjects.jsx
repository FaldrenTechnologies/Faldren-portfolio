import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Search,
  Plus,
  CalendarDays,
  MoreHorizontal
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import "../admin.css";


const API_BASE =
  "http://localhost:8080";


function AdminProjects() {

  const [projects, setProjects] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const adminName =
    localStorage.getItem(
      "adminName"
    ) || "Administrator";


  // ==========================================
  // LOAD PROJECTS
  // ==========================================

  const loadProjects =
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


        const response =
          await fetch(
            `${API_BASE}/api/admin/projects`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        // Admin session expired / invalid

        if (
          response.status === 401 ||
          response.status === 403
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

          window.location.href =
            "/admin/login";

          return;
        }


        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.message ||
            "Unable to load projects."
          );

          return;
        }


        setProjects(
          Array.isArray(data)
            ? data
            : []
        );


      } catch (error) {

        console.error(
          "Project loading error:",
          error
        );


        setError(
          "Unable to connect to the backend."
        );


      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    loadProjects();

  }, []);


  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredProjects =
    useMemo(() => {

      const searchValue =
        search
          .trim()
          .toLowerCase();


      return projects.filter(
        (project) => {

          const title =
            project.title || "";

          const clientName =
            project.clientFullName || "";

          const companyName =
            project.clientCompany || "";

          const category =
            project.serviceType || "";

          const status =
            project.status || "";


          const matchesSearch =

            title
              .toLowerCase()
              .includes(searchValue) ||

            clientName
              .toLowerCase()
              .includes(searchValue) ||

            companyName
              .toLowerCase()
              .includes(searchValue) ||

            category
              .toLowerCase()
              .includes(searchValue);


          const matchesStatus =

            statusFilter === "ALL" ||

            status === statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      projects,
      search,
      statusFilter
    ]);


  // ==========================================
  // FORMAT STATUS
  // ==========================================

  const formatStatus =
    (status) => {

      if (!status) {
        return "—";
      }


      return status.replaceAll(
        "_",
        " "
      );

    };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate =
    (date) => {

      if (!date) {
        return "—";
      }


      const parsed =
        new Date(
          `${date}T00:00:00`
        );


      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {
        return date;
      }


      return parsed.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      );

    };


  // ==========================================
  // CLIENT DISPLAY NAME
  // ==========================================

  const getClientDisplay =
    (project) => {

      if (
        project.clientCompany &&
        project.clientCompany.trim()
      ) {

        return project.clientCompany;

      }


      return (
        project.clientFullName ||
        "Client"
      );

    };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="admin-dashboard">

      <AdminSidebar />


      <main className="admin-main">


        {/* ================= TOP BAR ================= */}

        <header className="admin-topbar">

          <div>

            <span className="admin-page-label">
              FALDREN / ADMIN
            </span>

            <h1>
              Projects
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



        {/* ================= INTRO ================= */}

        <section className="admin-projects-intro">

          <div>

            <span className="admin-projects-kicker">
              PROJECT WORKSPACE
            </span>


            <h2>

              Work in
              <br />

              <em>
                motion.
              </em>

            </h2>


            <p>
              Create, assign and follow every
              FALDREN project from one workspace.
            </p>

          </div>


          <div className="admin-project-count">

            <span>
              TOTAL PROJECTS
            </span>

            <strong>

              {String(
                projects.length
              ).padStart(
                2,
                "0"
              )}

            </strong>

          </div>

        </section>



        {/* ================= SEARCH + FILTER ================= */}

        <section className="admin-project-actions">


          <div className="admin-project-search">

            <Search
              size={17}
              strokeWidth={1.7}
            />

            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={
                (event) =>
                  setSearch(
                    event.target.value
                  )
              }
            />

          </div>



          <div className="admin-project-action-right">


            <select
              className="admin-project-filter"
              value={statusFilter}
              onChange={
                (event) =>
                  setStatusFilter(
                    event.target.value
                  )
              }
            >

              <option value="ALL">
                All status
              </option>

              <option value="PLANNING">
                Planning
              </option>

              <option value="DESIGN">
                Design
              </option>

              <option value="DEVELOPMENT">
                Development
              </option>

              <option value="REVIEW">
                Review
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="ON_HOLD">
                On Hold
              </option>

            </select>



            {/* 
              Manual project creation
              backend flow later.
            */}

            <button
              className="admin-create-project-btn"
              type="button"
              title="Manual project creation will be added next"
            >

              <Plus
                size={17}
                strokeWidth={1.8}
              />

              Create project

            </button>

          </div>

        </section>



        {/* ================= ERROR ================= */}

        {error && (

          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              border:
                "1px solid rgba(130, 74, 60, 0.25)",
              color: "#7c463b"
            }}
          >

            {error}

          </div>

        )}



        {/* ================= PROJECT TABLE ================= */}

        <section className="admin-project-table">


          <div className="admin-project-table-head">

            <span>
              PROJECT
            </span>

            <span>
              CLIENT
            </span>

            <span>
              STATUS
            </span>

            <span>
              PROGRESS
            </span>

            <span>
              DUE DATE
            </span>

            <span>
              PRIORITY
            </span>

            <span>
              ACTION
            </span>

          </div>



          <div className="admin-project-list">


            {/* LOADING */}

            {loading ? (

              <div className="admin-project-empty">

                <span>
                  ...
                </span>

                <h3>
                  Loading projects.
                </h3>

                <p>
                  Fetching active FALDREN
                  projects.
                </p>

              </div>

            ) : filteredProjects.length >
              0 ? (


              /* ================= REAL PROJECTS ================= */

              filteredProjects.map(
                (project) => (

                  <article
                    className="admin-project-row"
                    key={project.id}
                  >


                    {/* PROJECT */}

                    <div className="admin-project-name">

                      <strong>
                        {project.title}
                      </strong>

                      <span>

                        {
                          project.serviceType ||
                          "Project"
                        }

                      </span>

                    </div>



                    {/* CLIENT */}

                    <div className="admin-project-client">

                      <strong>

                        {getClientDisplay(
                          project
                        )}

                      </strong>


                      {project.clientCompany &&
                        project.clientFullName && (

                        <span
                          style={{
                            display: "block",
                            marginTop: "3px",
                            fontSize: "10px",
                            opacity: 0.65
                          }}
                        >

                          {
                            project
                              .clientFullName
                          }

                        </span>

                      )}

                    </div>



                    {/* STATUS */}

                    <div>

                      <span
                        className={
                          `admin-project-status ${
                            (
                              project.status ||
                              "PLANNING"
                            ).toLowerCase()
                          }`
                        }
                      >

                        <i />

                        {formatStatus(
                          project.status
                        )}

                      </span>

                    </div>



                    {/* PROGRESS */}

                    <div className="admin-project-progress">

                      <div className="admin-project-progress-copy">

                        <span>
                          Progress
                        </span>

                        <strong>

                          {
                            project.progress ??
                            0
                          }%

                        </strong>

                      </div>


                      <div className="admin-progress-track">

                        <span
                          style={{
                            width:
                              `${Math.min(
                                Math.max(
                                  project.progress ??
                                  0,
                                  0
                                ),
                                100
                              )}%`
                          }}
                        />

                      </div>

                    </div>



                    {/* DUE DATE */}

                    <div className="admin-project-date">

                      <CalendarDays
                        size={14}
                        strokeWidth={1.5}
                      />

                      <span>

                        {formatDate(
                          project.dueDate
                        )}

                      </span>

                    </div>



                    {/* PRIORITY */}

                    <div>

                      <span
                        className={
                          `admin-project-priority ${
                            (
                              project.priority ||
                              "MEDIUM"
                            ).toLowerCase()
                          }`
                        }
                      >

                        {
                          project.priority ||
                          "MEDIUM"
                        }

                      </span>

                    </div>



                    {/* ACTION */}

                    <div className="admin-project-menu">

                      <button
                        type="button"
                        aria-label="Project actions"
                        title="Project editing will be added next"
                      >

                        <MoreHorizontal
                          size={19}
                          strokeWidth={1.6}
                        />

                      </button>

                    </div>

                  </article>

                )
              )

            ) : (

              /* ================= EMPTY ================= */

              <div className="admin-project-empty">

                <span>
                  00
                </span>

                <h3>
                  No projects found.
                </h3>

                <p>

                  {projects.length === 0

                    ? "Accepted client projects will appear here."

                    : "Try another search or status filter."}

                </p>

              </div>

            )}

          </div>

        </section>

      </main>

    </div>

  );

}


export default AdminProjects;