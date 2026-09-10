import React, {
  useEffect,
  useState
} from "react";

import "../styles/client.css";


const API_BASE =
  "http://localhost:8080";


const EMPTY_FORM = {
  projectName: "",
  serviceType: "",
  description: "",
  requirements: "",
  businessGoal: "",
  budgetRange: "",
  expectedDeadline: "",
  referenceLinks: "",
  additionalNotes: ""
};


function ClientDashboard({
  onLogout
}) {

  const [activeTab, setActiveTab] =
    useState("Dashboard");

  const [projects, setProjects] =
    useState([]);

  const [requests, setRequests] =
    useState([]);

  const [loadingProjects, setLoadingProjects] =
    useState(true);

  const [showProjectForm, setShowProjectForm] =
    useState(false);

  const [formData, setFormData] =
    useState(EMPTY_FORM);

  const [submitting, setSubmitting] =
    useState(false);

  const [projectError, setProjectError] =
    useState("");

  const [projectSuccess, setProjectSuccess] =
    useState("");


  const clientName =
    localStorage.getItem(
      "clientName"
    ) || "Client";

  const clientEmail =
    localStorage.getItem(
      "clientEmail"
    ) || "";

  const clientCompany =
    localStorage.getItem(
      "clientCompany"
    ) || "";


  const clientInitial =
    clientName
      .trim()
      .charAt(0)
      .toUpperCase() || "C";


  const navItems = [
    "Dashboard",
    "Projects",
    "Milestones",
    "Messages",
    "Files",
    "Profile"
  ];



  // ==========================================
  // LOAD PROJECTS + REQUESTS
  // ==========================================

  const loadProjectData =
    async () => {

      const token =
        localStorage.getItem(
          "clientToken"
        );


      if (!token) {

        onLogout?.();

        return;
      }


      try {

        setLoadingProjects(true);


        const [
          requestResponse,
          projectResponse
        ] =
          await Promise.all([

            fetch(
              `${API_BASE}/api/client/project-requests`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            ),

            fetch(
              `${API_BASE}/api/client/projects`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            )

          ]);


        if (
          requestResponse.status === 401 ||
          requestResponse.status === 403 ||
          projectResponse.status === 401 ||
          projectResponse.status === 403
        ) {

          onLogout?.();

          return;
        }


        const requestData =
          await requestResponse.json();

        const projectData =
          await projectResponse.json();


        if (requestResponse.ok) {

          setRequests(
            Array.isArray(requestData)
              ? requestData
              : []
          );

        }


        if (projectResponse.ok) {

          setProjects(
            Array.isArray(projectData)
              ? projectData
              : []
          );

        }


      } catch (error) {

        console.error(
          "Project loading error:",
          error
        );


      } finally {

        setLoadingProjects(false);

      }

    };


  useEffect(() => {

    loadProjectData();

  }, []);



  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleNav = (item) => {

    setActiveTab(item);

    setProjectError("");

    setProjectSuccess("");

  };



  // ==========================================
  // FORM
  // ==========================================

  const handleInputChange =
    (event) => {

      const {
        name,
        value
      } = event.target;


      setFormData(
        current => ({
          ...current,
          [name]: value
        })
      );

    };



  // ==========================================
  // CREATE PROJECT REQUEST
  // ==========================================

  const handleProjectSubmit =
    async (event) => {

      event.preventDefault();

      setProjectError("");
      setProjectSuccess("");


      const token =
        localStorage.getItem(
          "clientToken"
        );


      if (!token) {

        onLogout?.();

        return;
      }


      setSubmitting(true);


      try {

        const response =
          await fetch(
            `${API_BASE}/api/client/project-requests`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body:
                JSON.stringify(
                  formData
                )
            }
          );


        const data =
          await response.json();


        if (
          response.status === 401 ||
          response.status === 403
        ) {

          onLogout?.();

          return;
        }


        if (!response.ok) {

          setProjectError(
            data.message ||
            "Unable to submit project request."
          );

          return;
        }


        setProjectSuccess(
          "Project request submitted successfully. FALDREN will review it shortly."
        );


        setFormData(
          EMPTY_FORM
        );


        setShowProjectForm(
          false
        );


        await loadProjectData();


      } catch (error) {

        console.error(
          "Project submission error:",
          error
        );


        setProjectError(
          "Unable to connect to the server."
        );


      } finally {

        setSubmitting(false);

      }

    };



  const formatStatus =
    (status) => {

      return (
        status ||
        ""
      )
        .replaceAll(
          "_",
          " "
        );
    };


  const formatDate =
    (date) => {

      if (!date) {
        return "—";
      }


      return new Date(
        `${date}T00:00:00`
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      );

    };


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


  const currentProject =
    activeProjects[0];



  return (

    <main className="client-page">


      {/* ================= SIDEBAR ================= */}

      <aside className="client-sidebar">


        <div className="client-logo">

          <span>
            FALDREN
          </span>

          <small>
            CLIENT PORTAL
          </small>

        </div>


        <nav className="client-nav">

          {navItems.map(
            item => (

              <button
                key={item}
                className={
                  activeTab === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleNav(item)
                }
              >

                <span>
                  {item}
                </span>

              </button>

            )
          )}

        </nav>


        <button
          className="logout-button"
          onClick={onLogout}
        >

          <span>
            Logout
          </span>

          <span>
            ↗
          </span>

        </button>

      </aside>



      {/* ================= CONTENT ================= */}

      <section className="client-content">


        <header className="client-header">

          <div>

            <p className="dashboard-eyebrow">

              CLIENT /{" "}
              {activeTab.toUpperCase()}

            </p>


            <h1>

              {activeTab ===
              "Dashboard"
                ? `Welcome back, ${clientName}.`
                : activeTab}

            </h1>

          </div>


          <button
            className="client-avatar"
            onClick={() =>
              setActiveTab(
                "Profile"
              )
            }
          >
            {clientInitial}
          </button>

        </header>



        {/* ================= DASHBOARD ================= */}

        {activeTab ===
          "Dashboard" && (

          <>


            <section className="dashboard-stats">


              <div className="dashboard-card">

                <span>
                  ACTIVE PROJECTS
                </span>

                <strong>
                  {
                    activeProjects
                      .length
                  }
                </strong>

                <small>
                  Currently running
                </small>

              </div>


              <div className="dashboard-card">

                <span>
                  COMPLETED
                </span>

                <strong>
                  {
                    completedProjects
                      .length
                  }
                </strong>

                <small>
                  Successfully delivered
                </small>

              </div>


              <div className="dashboard-card">

                <span>
                  REQUESTS
                </span>

                <strong>
                  {
                    pendingRequests
                      .length
                  }
                </strong>

                <small>
                  Waiting for review
                </small>

              </div>


              <div className="dashboard-card">

                <span>
                  TOTAL PROJECTS
                </span>

                <strong>
                  {projects.length}
                </strong>

                <small>
                  With FALDREN
                </small>

              </div>

            </section>



            {currentProject ? (

              <section className="project-section">


                <div className="section-title">

                  <div>

                    <p>
                      CURRENT PROJECT
                    </p>

                    <h2>
                      {
                        currentProject
                          .title
                      }
                    </h2>

                  </div>


                  <span className="project-status">

                    {formatStatus(
                      currentProject
                        .status
                    )}

                  </span>

                </div>



                <div className="project-progress">

                  <div className="progress-info">

                    <span>
                      Project Progress
                    </span>

                    <strong>
                      {
                        currentProject
                          .progress
                      }%
                    </strong>

                  </div>


                  <div className="progress-track">

                    <div
                      className="progress-fill"
                      style={{
                        width:
                          `${
                            currentProject
                              .progress
                          }%`
                      }}
                    />

                  </div>

                </div>



                <div className="project-details">

                  <div>

                    <span>
                      START DATE
                    </span>

                    <strong>
                      {formatDate(
                        currentProject
                          .startDate
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      DEADLINE
                    </span>

                    <strong>
                      {formatDate(
                        currentProject
                          .dueDate
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      SERVICE
                    </span>

                    <strong>
                      {
                        currentProject
                          .serviceType
                      }
                    </strong>

                  </div>

                </div>

              </section>

            ) : (

              <section className="project-section">

                <div className="section-title">

                  <div>

                    <p>
                      PROJECT WORKSPACE
                    </p>

                    <h2>
                      No active project yet.
                    </h2>

                  </div>

                </div>


                <p>
                  Submit a project request from
                  the Projects section to start
                  working with FALDREN.
                </p>

              </section>

            )}

          </>

        )}



        {/* ================= PROJECTS ================= */}

        {activeTab ===
          "Projects" && (

          <section className="portal-panel">


            <div className="client-project-toolbar">

              <div className="panel-heading">

                <p>
                  YOUR WORK
                </p>

                <h2>
                  Projects
                </h2>

              </div>


              <button
                type="button"
                className="client-add-project"
                onClick={() => {

                  setProjectError("");

                  setProjectSuccess("");

                  setShowProjectForm(
                    current =>
                      !current
                  );

                }}
              >

                {showProjectForm
                  ? "Close"
                  : "+ Add Project"}

              </button>

            </div>



            {projectSuccess && (

              <div className="client-project-success">
                {projectSuccess}
              </div>

            )}



            {projectError && (

              <div className="client-project-error">
                {projectError}
              </div>

            )}



            {/* ADD PROJECT FORM */}

            {showProjectForm && (

              <div className="client-project-form-wrap">


                <div className="client-project-form-head">

                  <span>
                    NEW REQUEST
                  </span>

                  <h3>
                    Tell us what you want to build.
                  </h3>

                  <p>
                    Your account details are
                    automatically attached to this
                    request.
                  </p>

                </div>



                <form
                  className="client-project-form"
                  onSubmit={
                    handleProjectSubmit
                  }
                >


                  <div className="client-project-form-row">


                    <div className="client-project-field">

                      <label>
                        Project name *
                      </label>

                      <input
                        type="text"
                        name="projectName"
                        placeholder="Example: FALDREN Commerce Platform"
                        value={
                          formData
                            .projectName
                        }
                        onChange={
                          handleInputChange
                        }
                        maxLength="180"
                        required
                      />

                    </div>



                    <div className="client-project-field">

                      <label>
                        Service type *
                      </label>

                      <select
                        name="serviceType"
                        value={
                          formData
                            .serviceType
                        }
                        onChange={
                          handleInputChange
                        }
                        required
                      >

                        <option value="">
                          Select service
                        </option>

                        <option value="Website">
                          Website
                        </option>

                        <option value="Web Application">
                          Web Application
                        </option>

                        <option value="Mobile Application">
                          Mobile Application
                        </option>

                        <option value="Custom Software">
                          Custom Software
                        </option>

                        <option value="UI / UX">
                          UI / UX
                        </option>

                        <option value="Digital Product">
                          Digital Product
                        </option>

                        <option value="Other">
                          Other
                        </option>

                      </select>

                    </div>

                  </div>



                  <div className="client-project-field">

                    <label>
                      Project description *
                    </label>

                    <textarea
                      name="description"
                      rows="5"
                      placeholder="Explain the project and what you want to build."
                      value={
                        formData
                          .description
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />

                  </div>



                  <div className="client-project-field">

                    <label>
                      Main requirements / features *
                    </label>

                    <textarea
                      name="requirements"
                      rows="5"
                      placeholder="Example: Login, dashboard, payment, admin panel, reports..."
                      value={
                        formData
                          .requirements
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />

                  </div>



                  <div className="client-project-field">

                    <label>
                      Business goal / purpose *
                    </label>

                    <textarea
                      name="businessGoal"
                      rows="4"
                      placeholder="What problem should this project solve?"
                      value={
                        formData
                          .businessGoal
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />

                  </div>



                  <div className="client-project-form-row">


                    <div className="client-project-field">

                      <label>
                        Budget range *
                      </label>

                      <select
                        name="budgetRange"
                        value={
                          formData
                            .budgetRange
                        }
                        onChange={
                          handleInputChange
                        }
                        required
                      >

                        <option value="">
                          Select budget
                        </option>

                        <option value="Under ₹25,000">
                          Under ₹25,000
                        </option>

                        <option value="₹25,000 – ₹50,000">
                          ₹25,000 – ₹50,000
                        </option>

                        <option value="₹50,000 – ₹1,00,000">
                          ₹50,000 – ₹1,00,000
                        </option>

                        <option value="₹1,00,000+">
                          ₹1,00,000+
                        </option>

                        <option value="Let's discuss">
                          Let's discuss
                        </option>

                      </select>

                    </div>



                    <div className="client-project-field">

                      <label>
                        Expected deadline *
                      </label>

                      <input
                        type="date"
                        name="expectedDeadline"
                        value={
                          formData
                            .expectedDeadline
                        }
                        onChange={
                          handleInputChange
                        }
                        min={
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        required
                      />

                    </div>

                  </div>



                  <div className="client-project-field">

                    <label>
                      Reference / inspiration links
                    </label>

                    <textarea
                      name="referenceLinks"
                      rows="3"
                      placeholder="Website links, Figma links or other references."
                      value={
                        formData
                          .referenceLinks
                      }
                      onChange={
                        handleInputChange
                      }
                    />

                  </div>



                  <div className="client-project-field">

                    <label>
                      Additional notes
                    </label>

                    <textarea
                      name="additionalNotes"
                      rows="4"
                      placeholder="Anything else FALDREN should know?"
                      value={
                        formData
                          .additionalNotes
                      }
                      onChange={
                        handleInputChange
                      }
                    />

                  </div>



                  <div className="client-project-submit-row">

                    <button
                      type="button"
                      className="client-project-cancel"
                      onClick={() => {

                        setShowProjectForm(
                          false
                        );

                        setProjectError("");

                      }}
                      disabled={
                        submitting
                      }
                    >
                      Cancel
                    </button>


                    <button
                      type="submit"
                      className="client-project-submit"
                      disabled={
                        submitting
                      }
                    >

                      {submitting
                        ? "Submitting..."
                        : "Submit Project Request"}

                    </button>

                  </div>

                </form>

              </div>

            )}



            {/* ACTIVE PROJECTS */}

            <div className="client-project-group">

              <div className="client-project-group-title">

                <span>
                  ACTIVE / ACCEPTED
                </span>

                <strong>
                  {projects.length}
                </strong>

              </div>


              {loadingProjects ? (

                <p className="client-project-empty">
                  Loading projects...
                </p>

              ) : projects.length === 0 ? (

                <p className="client-project-empty">
                  No accepted projects yet.
                </p>

              ) : (

                <div className="project-list">

                  {projects.map(
                    (project, index) => (

                      <article
                        className={
                          `portal-project-card ${
                            project.status ===
                            "COMPLETED"
                              ? "completed"
                              : ""
                          }`
                        }
                        key={project.id}
                      >

                        <div>

                          <span>

                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}

                            {" / "}

                            {formatStatus(
                              project.status
                            )}

                          </span>


                          <h3>
                            {project.title}
                          </h3>


                          <p>
                            {
                              project
                                .description
                            }
                          </p>


                          <small>

                            {
                              project
                                .serviceType
                            }

                            {" · Due "}

                            {formatDate(
                              project
                                .dueDate
                            )}

                          </small>

                        </div>


                        <strong>
                          {
                            project
                              .progress
                          }%
                        </strong>

                      </article>

                    )
                  )}

                </div>

              )}

            </div>



            {/* REQUEST HISTORY */}

            <div className="client-project-group">

              <div className="client-project-group-title">

                <span>
                  REQUEST HISTORY
                </span>

                <strong>
                  {requests.length}
                </strong>

              </div>


              {requests.length === 0 ? (

                <p className="client-project-empty">
                  You haven't submitted a project request yet.
                </p>

              ) : (

                <div className="client-request-list">

                  {requests.map(
                    request => (

                      <article
                        className="client-request-card"
                        key={request.id}
                      >

                        <div>

                          <span
                            className={
                              `client-request-status ${
                                request.status
                                  .toLowerCase()
                              }`
                            }
                          >
                            {
                              request.status
                            }
                          </span>


                          <h3>
                            {
                              request
                                .projectName
                            }
                          </h3>


                          <p>
                            {
                              request
                                .serviceType
                            }
                          </p>

                        </div>


                        <div className="client-request-meta">

                          <span>
                            {
                              request
                                .budgetRange
                            }
                          </span>

                          <span>
                            Deadline{" "}
                            {formatDate(
                              request
                                .expectedDeadline
                            )}
                          </span>

                        </div>

                      </article>

                    )
                  )}

                </div>

              )}

            </div>

          </section>

        )}



        {/* ================= MILESTONES ================= */}

        {activeTab ===
          "Milestones" && (

          <section className="portal-panel">

            <div className="panel-heading">

              <p>
                PROJECT TIMELINE
              </p>

              <h2>
                Milestones
              </h2>

            </div>


            <p>
              Project milestones will appear
              here as FALDREN updates your
              active projects.
            </p>

          </section>

        )}



        {/* ================= MESSAGES ================= */}

        {activeTab ===
          "Messages" && (

          <section className="portal-panel">

            <div className="panel-heading">

              <p>
                COMMUNICATION
              </p>

              <h2>
                Messages
              </h2>

            </div>


            <p>
              Project conversations will
              appear here.
            </p>

          </section>

        )}



        {/* ================= FILES ================= */}

        {activeTab ===
          "Files" && (

          <section className="portal-panel">

            <div className="panel-heading">

              <p>
                PROJECT DOCUMENTS
              </p>

              <h2>
                Files
              </h2>

            </div>


            <p>
              Files shared for your projects
              will appear here.
            </p>

          </section>

        )}



        {/* ================= PROFILE ================= */}

        {activeTab ===
          "Profile" && (

          <section className="portal-panel">

            <div className="panel-heading">

              <p>
                ACCOUNT
              </p>

              <h2>
                Profile
              </h2>

            </div>


            <div className="profile-card">

              <div className="profile-avatar">
                {clientInitial}
              </div>


              <div className="profile-info">

                <div>

                  <span>
                    NAME
                  </span>

                  <strong>
                    {clientName}
                  </strong>

                </div>


                <div>

                  <span>
                    EMAIL
                  </span>

                  <strong>
                    {clientEmail}
                  </strong>

                </div>


                <div>

                  <span>
                    COMPANY
                  </span>

                  <strong>
                    {clientCompany || "—"}
                  </strong>

                </div>


                <div>

                  <span>
                    ACCOUNT TYPE
                  </span>

                  <strong>
                    FALDREN Client
                  </strong>

                </div>

              </div>

            </div>

          </section>

        )}

      </section>

    </main>

  );
}


export default ClientDashboard;