import React, { useState } from "react";
import {
  Search,
  Plus,
  CalendarDays,
  MoreHorizontal
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import "../admin.css";


const initialProjects = [
  {
    id: 1,
    title: "Company Website",
    clientName: "FJ Studio",
    category: "Website",
    status: "DEVELOPMENT",
    progress: 65,
    dueDate: "2026-09-30",
    priority: "HIGH"
  },
  {
    id: 2,
    title: "Business Dashboard",
    clientName: "HK Technologies",
    category: "Web Application",
    status: "DESIGN",
    progress: 30,
    dueDate: "2026-10-10",
    priority: "MEDIUM"
  },
  {
    id: 3,
    title: "Consultancy Website",
    clientName: "Best Auto Consultancy",
    category: "Website",
    status: "PLANNING",
    progress: 10,
    dueDate: "2026-10-20",
    priority: "LOW"
  }
];


function AdminProjects() {

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");


  const filteredProjects = initialProjects.filter((project) => {

    const searchValue = search.toLowerCase();

    const matchesSearch =
      project.title.toLowerCase().includes(searchValue) ||
      project.clientName.toLowerCase().includes(searchValue) ||
      project.category.toLowerCase().includes(searchValue);


    const matchesStatus =
      statusFilter === "ALL" ||
      project.status === statusFilter;


    return matchesSearch && matchesStatus;

  });


  const formatStatus = (status) => {

    if (status === "ON_HOLD") {
      return "ON HOLD";
    }

    return status;

  };


  return (

    <div className="admin-dashboard">

      <AdminSidebar />


      <main className="admin-main">


        {/* TOP BAR */}

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
                Administrator
              </strong>

              <span>
                FALDREN
              </span>

            </div>


            <div className="admin-avatar">
              A
            </div>

          </div>

        </header>



        {/* INTRO */}

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
              {String(initialProjects.length).padStart(2, "0")}
            </strong>

          </div>

        </section>



        {/* SEARCH + FILTER */}

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
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="admin-project-action-right">

            <select
              className="admin-project-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
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


            <button
              className="admin-create-project-btn"
              type="button"
            >

              <Plus
                size={17}
                strokeWidth={1.8}
              />

              Create project

            </button>

          </div>

        </section>



        {/* PROJECT TABLE */}

        <section className="admin-project-table">

          <div className="admin-project-table-head">

            <span>PROJECT</span>
            <span>CLIENT</span>
            <span>STATUS</span>
            <span>PROGRESS</span>
            <span>DUE DATE</span>
            <span>PRIORITY</span>
            <span>ACTION</span>

          </div>


          <div className="admin-project-list">

            {filteredProjects.length > 0 ? (

              filteredProjects.map((project) => (

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
                      {project.category}
                    </span>

                  </div>



                  {/* CLIENT */}

                  <div className="admin-project-client">
                    {project.clientName}
                  </div>



                  {/* STATUS */}

                  <div>

                    <span
                      className={
                        `admin-project-status ${project.status.toLowerCase()}`
                      }
                    >

                      <i />

                      {formatStatus(project.status)}

                    </span>

                  </div>



                  {/* PROGRESS */}

                  <div className="admin-project-progress">

                    <div className="admin-project-progress-copy">

                      <span>
                        Progress
                      </span>

                      <strong>
                        {project.progress}%
                      </strong>

                    </div>


                    <div className="admin-progress-track">

                      <span
                        style={{
                          width: `${project.progress}%`
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
                      {project.dueDate}
                    </span>

                  </div>



                  {/* PRIORITY */}

                  <div>

                    <span
                      className={
                        `admin-project-priority ${project.priority.toLowerCase()}`
                      }
                    >
                      {project.priority}
                    </span>

                  </div>



                  {/* ACTION */}

                  <div className="admin-project-menu">

                    <button
                      type="button"
                      aria-label="Project actions"
                    >

                      <MoreHorizontal
                        size={19}
                        strokeWidth={1.6}
                      />

                    </button>

                  </div>

                </article>

              ))

            ) : (

              <div className="admin-project-empty">

                <span>
                  00
                </span>

                <h3>
                  No projects found.
                </h3>

                <p>
                  Try another search or status filter.
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