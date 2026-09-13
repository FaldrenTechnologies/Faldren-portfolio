import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Search,
  Plus,
  CalendarDays,
  MoreHorizontal,
  X,
  GitBranch,
  UserRound,
  FolderKanban
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";

import "../admin.css";


const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");


const EMPTY_MODULE_FORM = {
  moduleName: "",
  developerId: "",
  description: "",
  acceptanceCriteria: "",
  repoUrl: "",
  baseBranch: "develop",
  branchName: "",
  priority: "MEDIUM",
  deadline: ""
};


function AdminProjects() {

  // ==========================================
  // PROJECT STATES
  // ==========================================

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

  const [
    openMenuId,
    setOpenMenuId
  ] = useState(null);

  const [
    projectToDelete,
    setProjectToDelete
  ] = useState(null);

  const [
    deletingProjectId,
    setDeletingProjectId
  ] = useState(null);


  // ==========================================
  // MODULE STATES
  // ==========================================

  const [
    selectedProject,
    setSelectedProject
  ] = useState(null);

  const [
    developers,
    setDevelopers
  ] = useState([]);

  const [
    modules,
    setModules
  ] = useState([]);

  const [
    modulesLoading,
    setModulesLoading
  ] = useState(false);

  const [
    moduleSaving,
    setModuleSaving
  ] = useState(false);

  const [
    moduleError,
    setModuleError
  ] = useState("");

  const [
    moduleSuccess,
    setModuleSuccess
  ] = useState("");

  const [
    showModuleForm,
    setShowModuleForm
  ] = useState(false);

  const [
    branchManuallyEdited,
    setBranchManuallyEdited
  ] = useState(false);

  const [
    moduleForm,
    setModuleForm
  ] = useState(
    EMPTY_MODULE_FORM
  );


  const adminName =
    localStorage.getItem(
      "adminName"
    ) || "Administrator";


  // ==========================================
  // ADMIN TOKEN
  // ==========================================

  const getAdminToken = () =>
    localStorage.getItem(
      "adminToken"
    );


  // ==========================================
  // ADMIN LOGOUT ON INVALID SESSION
  // ==========================================

  const clearAdminSession = () => {

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
  };


  // ==========================================
  // LOAD PROJECTS
  // ==========================================

  const loadProjects =
    async () => {

      const token =
        getAdminToken();


      if (!token) {

        clearAdminSession();

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


        if (
          response.status === 401 ||
          response.status === 403
        ) {

          clearAdminSession();

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


  // ==========================================
  // LOAD DEVELOPERS
  // ==========================================

  const loadDevelopers =
    async () => {

      const token =
        getAdminToken();


      if (!token) {
        return;
      }


      try {

        const response =
          await fetch(
            `${API_BASE}/api/admin/developers`,
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

          clearAdminSession();

          return;
        }


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to load developers."
          );
        }


        setDevelopers(
          Array.isArray(data)
            ? data.filter(
                developer =>
                  developer.active
              )
            : []
        );


      } catch (error) {

        console.error(
          "Developer loading error:",
          error
        );

      }

    };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    loadProjects();

    loadDevelopers();

  }, []);


  // ==========================================
  // LOAD MODULES FOR PROJECT
  // ==========================================

  const loadProjectModules =
    async (projectId) => {

      const token =
        getAdminToken();


      if (!token) {

        clearAdminSession();

        return;
      }


      try {

        setModulesLoading(true);
        setModuleError("");


        const response =
          await fetch(
            `${API_BASE}/api/admin/modules/project/${projectId}`,
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

          clearAdminSession();

          return;
        }


        const data =
          await response.json();


        if (!response.ok) {

          setModuleError(
            data.message ||
            "Unable to load modules."
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
          "Module loading error:",
          error
        );


        setModuleError(
          "Unable to connect to the backend."
        );


      } finally {

        setModulesLoading(false);

      }

    };


  // ==========================================
  // OPEN MODULE WORKSPACE
  // ==========================================

  const openModuleWorkspace =
    (project) => {

      setSelectedProject(
        project
      );

      setModules([]);

      setModuleError("");

      setModuleSuccess("");

      setShowModuleForm(false);

      setModuleForm(
        EMPTY_MODULE_FORM
      );

      setBranchManuallyEdited(
        false
      );


      loadProjectModules(
        project.id
      );

    };


  // ==========================================
  // CLOSE MODULE WORKSPACE
  // ==========================================

  const closeModuleWorkspace =
    () => {

      setSelectedProject(null);

      setModules([]);

      setModuleError("");

      setModuleSuccess("");

      setShowModuleForm(false);

      setModuleForm(
        EMPTY_MODULE_FORM
      );

      setBranchManuallyEdited(
        false
      );

    };


  // ==========================================
  // BRANCH SLUG
  // ==========================================

  const createBranchName =
    (
      projectId,
      moduleName
    ) => {

      const slug =
        moduleName
          .trim()
          .toLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            ""
          );


      if (!slug) {
        return "";
      }


      return `feature/P${projectId}-${slug}`;
    };


  // ==========================================
  // MODULE FORM CHANGE
  // ==========================================

  const handleModuleChange =
    (event) => {

      const {
        name,
        value
      } = event.target;


      if (
        name === "branchName"
      ) {

        setBranchManuallyEdited(
          true
        );


        setModuleForm(
          current => ({
            ...current,
            branchName: value
          })
        );

        return;
      }


      setModuleForm(
        current => {

          const updated = {
            ...current,
            [name]: value
          };


          if (
            name === "moduleName" &&
            selectedProject &&
            !branchManuallyEdited
          ) {

            updated.branchName =
              createBranchName(
                selectedProject.id,
                value
              );

          }


          return updated;

        }
      );

    };


  // ==========================================
  // RESET MODULE FORM
  // ==========================================

  const resetModuleForm =
    () => {

      setModuleForm(
        EMPTY_MODULE_FORM
      );

      setBranchManuallyEdited(
        false
      );

      setModuleError("");

      setModuleSuccess("");

    };


  // ==========================================
  // CREATE MODULE
  // ==========================================

  const handleCreateModule =
    async (event) => {

      event.preventDefault();


      if (!selectedProject) {
        return;
      }


      const token =
        getAdminToken();


      if (!token) {

        clearAdminSession();

        return;
      }


      if (
        !moduleForm.moduleName.trim()
      ) {

        setModuleError(
          "Module name is required."
        );

        return;
      }


      if (
        !moduleForm.developerId
      ) {

        setModuleError(
          "Select a developer."
        );

        return;
      }


      if (
        !moduleForm.branchName.trim()
      ) {

        setModuleError(
          "Git branch name is required."
        );

        return;
      }


      try {

        setModuleSaving(true);

        setModuleError("");

        setModuleSuccess("");


        const response =
          await fetch(
            `${API_BASE}/api/admin/modules`,
            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`

              },

              body: JSON.stringify({

                projectId:
                  selectedProject.id,

                developerId:
                  Number(
                    moduleForm.developerId
                  ),

                moduleName:
                  moduleForm
                    .moduleName
                    .trim(),

                description:
                  moduleForm
                    .description
                    .trim(),

                acceptanceCriteria:
                  moduleForm
                    .acceptanceCriteria
                    .trim(),

                repoUrl:
                  moduleForm
                    .repoUrl
                    .trim(),

                baseBranch:
                  moduleForm
                    .baseBranch
                    .trim(),

                branchName:
                  moduleForm
                    .branchName
                    .trim(),

                priority:
                  moduleForm.priority,

                deadline:
                  moduleForm.deadline ||
                  null

              })
            }
          );


        if (
          response.status === 401 ||
          response.status === 403
        ) {

          clearAdminSession();

          return;
        }


        const data =
          await response.json();


        if (!response.ok) {

          setModuleError(
            data.message ||
            "Unable to create module."
          );

          return;
        }


        setModules(
          current => [
            data,
            ...current
          ]
        );


        resetModuleForm();

        setShowModuleForm(
          false
        );


        setModuleSuccess(
          "Module created and assigned successfully."
        );


      } catch (error) {

        console.error(
          "Module creation error:",
          error
        );


        setModuleError(
          "Unable to connect to the backend."
        );


      } finally {

        setModuleSaving(false);

      }

    };


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
        project => {

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
              .includes(
                searchValue
              ) ||

            clientName
              .toLowerCase()
              .includes(
                searchValue
              ) ||

            companyName
              .toLowerCase()
              .includes(
                searchValue
              ) ||

            category
              .toLowerCase()
              .includes(
                searchValue
              );


          const matchesStatus =

            statusFilter === "ALL" ||

            status ===
              statusFilter;


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
    status => {

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
    date => {

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


      return parsed
        .toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }
        );

    };


  // ==========================================
  // CLIENT DISPLAY
  // ==========================================

  const getClientDisplay =
    project => {

      if (
        project.clientCompany &&
        project
          .clientCompany
          .trim()
      ) {

        return project.clientCompany;

      }


      return (
        project.clientFullName ||
        "Client"
      );

    };


  // ==========================================
  // DELETE PROJECT
  // ==========================================

  const handleDeleteProject =
    async () => {

      if (!projectToDelete) {
        return;
      }


      const token =
        getAdminToken();


      if (!token) {

        clearAdminSession();

        return;
      }


      try {

        setDeletingProjectId(
          projectToDelete.id
        );

        setError("");


        const response =
          await fetch(
            `${API_BASE}/api/admin/projects/${projectToDelete.id}`,
            {
              method: "DELETE",

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

          clearAdminSession();

          return;
        }


        let data = {};

        try {

          data =
            await response.json();

        } catch {

          data = {};
        }


        if (!response.ok) {

          setError(
            data.message ||
            "Unable to delete project."
          );

          return;
        }


        setProjects(
          current =>
            current.filter(
              project =>
                project.id !==
                projectToDelete.id
            )
        );


        if (
          selectedProject?.id ===
          projectToDelete.id
        ) {

          closeModuleWorkspace();
        }


        setProjectToDelete(
          null
        );

        setOpenMenuId(
          null
        );


      } catch (error) {

        console.error(
          "Project deletion error:",
          error
        );


        setError(
          "Unable to connect to the backend."
        );


      } finally {

        setDeletingProjectId(
          null
        );

      }

    };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="admin-dashboard">

      <AdminSidebar />


      <main className="admin-main">


        {/* ======================================
            TOP BAR
        ====================================== */}

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


        {/* ======================================
            INTRO
        ====================================== */}

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


        {/* ======================================
            SEARCH + FILTER
        ====================================== */}

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
                event =>
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
                event =>
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


            <button
              className="admin-create-project-btn"
              type="button"
              title="Manual project creation will be added later"
            >

              <Plus
                size={17}
                strokeWidth={1.8}
              />

              Create project

            </button>

          </div>

        </section>


        {/* ======================================
            PROJECT ERROR
        ====================================== */}

        {error && (

          <div className="admin-project-api-error">
            {error}
          </div>

        )}


        {/* ======================================
            PROJECT TABLE
        ====================================== */}

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

            ) : filteredProjects.length > 0 ? (

              filteredProjects.map(
                project => (

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

                    <div
                      className="admin-project-menu"
                      style={{
                        position: "relative"
                      }}
                    >

                      <button
                        type="button"
                        aria-label="Project actions"
                        title="Project actions"
                        onClick={() =>
                          setOpenMenuId(
                            current =>
                              current === project.id
                                ? null
                                : project.id
                          )
                        }
                      >

                        <MoreHorizontal
                          size={19}
                          strokeWidth={1.6}
                        />

                      </button>


                      {openMenuId === project.id && (

                        <div
                          style={{
                            position: "absolute",
                            top: "34px",
                            right: 0,
                            zIndex: 40,
                            width: "155px",
                            padding: "5px",
                            background: "#f5f1e8",
                            border:
                              "1px solid rgba(25, 25, 22, 0.18)",
                            boxShadow:
                              "0 12px 30px rgba(20, 20, 18, 0.12)"
                          }}
                        >

                          <button
                            type="button"
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              border: 0,
                              background: "transparent",
                              textAlign: "left",
                              fontFamily: "inherit",
                              fontSize: "11px",
                              color: "#1c1c19",
                              cursor: "pointer"
                            }}
                            onClick={() => {

                              setOpenMenuId(
                                null
                              );

                              openModuleWorkspace(
                                project
                              );

                            }}
                          >

                            Manage modules

                          </button>


                          <button
                            type="button"
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              border: 0,
                              background: "transparent",
                              textAlign: "left",
                              fontFamily: "inherit",
                              fontSize: "11px",
                              color: "#8a4037",
                              cursor: "pointer"
                            }}
                            onClick={() => {

                              setProjectToDelete(
                                project
                              );

                              setOpenMenuId(
                                null
                              );

                            }}
                          >

                            Delete project

                          </button>

                        </div>

                      )}

                    </div>

                  </article>

                )
              )

            ) : (

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


      {/* ========================================
          MODULE WORKSPACE DRAWER
      ======================================== */}

      {selectedProject && (

        <div
          className="admin-module-backdrop"
          onClick={
            closeModuleWorkspace
          }
        >

          <aside
            className="admin-module-drawer"
            onClick={
              event =>
                event.stopPropagation()
            }
          >


            {/* HEADER */}

            <div className="admin-module-drawer-head">

              <div>

                <span>
                  PROJECT /
                  {" "}
                  {String(
                    selectedProject.id
                  ).padStart(
                    3,
                    "0"
                  )}
                </span>

                <h2>
                  Manage modules
                </h2>

                <p>
                  {selectedProject.title}
                </p>

              </div>


              <button
                type="button"
                onClick={
                  closeModuleWorkspace
                }
                aria-label="Close module workspace"
              >

                <X
                  size={20}
                />

              </button>

            </div>


            {/* MODULE SUMMARY */}

            <div className="admin-module-summary">

              <div>

                <span>
                  MODULES
                </span>

                <strong>
                  {String(
                    modules.length
                  ).padStart(
                    2,
                    "0"
                  )}
                </strong>

              </div>


              <div>

                <span>
                  PROJECT
                </span>

                <strong>
                  {selectedProject.title}
                </strong>

              </div>

            </div>


            {/* MESSAGES */}

            {moduleError && (

              <div className="admin-module-error">
                {moduleError}
              </div>

            )}


            {moduleSuccess && (

              <div className="admin-module-success">
                {moduleSuccess}
              </div>

            )}


            {/* ADD MODULE BUTTON */}

            {!showModuleForm && (

              <button
                type="button"
                className="admin-module-add-btn"
                onClick={() => {

                  resetModuleForm();

                  setShowModuleForm(
                    true
                  );

                }}
              >

                <Plus
                  size={17}
                />

                Add module

              </button>

            )}


            {/* ==================================
                CREATE MODULE FORM
            ================================== */}

            {showModuleForm && (

              <form
                className="admin-module-form"
                onSubmit={
                  handleCreateModule
                }
              >

                <div className="admin-module-form-head">

                  <div>

                    <span>
                      NEW MODULE
                    </span>

                    <h3>
                      Assign work
                    </h3>

                  </div>


                  <button
                    type="button"
                    onClick={() => {

                      resetModuleForm();

                      setShowModuleForm(
                        false
                      );

                    }}
                  >

                    <X
                      size={18}
                    />

                  </button>

                </div>


                {/* MODULE NAME */}

                <div className="admin-module-field">

                  <label>
                    Module name *
                  </label>

                  <input
                    type="text"
                    name="moduleName"
                    placeholder="Authentication"
                    value={
                      moduleForm.moduleName
                    }
                    onChange={
                      handleModuleChange
                    }
                    required
                  />

                </div>


                {/* DEVELOPER */}

                <div className="admin-module-field">

                  <label>
                    Assigned developer *
                  </label>

                  <select
                    name="developerId"
                    value={
                      moduleForm.developerId
                    }
                    onChange={
                      handleModuleChange
                    }
                    required
                  >

                    <option value="">
                      Select developer
                    </option>

                    {developers.map(
                      developer => (

                        <option
                          key={developer.id}
                          value={developer.id}
                        >

                          {developer.fullName}
                          {" — "}
                          {developer.email}

                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* DESCRIPTION */}

                <div className="admin-module-field">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    placeholder="Describe the work expected in this module..."
                    value={
                      moduleForm.description
                    }
                    onChange={
                      handleModuleChange
                    }
                    rows={3}
                  />

                </div>


                {/* ACCEPTANCE CRITERIA */}

                <div className="admin-module-field">

                  <label>
                    Acceptance criteria
                  </label>

                  <textarea
                    name="acceptanceCriteria"
                    placeholder="What must be completed before this module can be approved?"
                    value={
                      moduleForm
                        .acceptanceCriteria
                    }
                    onChange={
                      handleModuleChange
                    }
                    rows={3}
                  />

                </div>


                {/* REPO */}

                <div className="admin-module-field">

                  <label>
                    Repository URL
                  </label>

                  <input
                    type="url"
                    name="repoUrl"
                    placeholder="https://github.com/..."
                    value={
                      moduleForm.repoUrl
                    }
                    onChange={
                      handleModuleChange
                    }
                  />

                </div>


                {/* BRANCH ROW */}

                <div className="admin-module-form-row">

                  <div className="admin-module-field">

                    <label>
                      Base branch
                    </label>

                    <input
                      type="text"
                      name="baseBranch"
                      placeholder="develop"
                      value={
                        moduleForm.baseBranch
                      }
                      onChange={
                        handleModuleChange
                      }
                    />

                  </div>


                  <div className="admin-module-field">

                    <label>
                      Feature branch *
                    </label>

                    <input
                      type="text"
                      name="branchName"
                      placeholder="feature/P1-auth"
                      value={
                        moduleForm.branchName
                      }
                      onChange={
                        handleModuleChange
                      }
                      required
                    />

                  </div>

                </div>


                {/* PRIORITY / DEADLINE */}

                <div className="admin-module-form-row">

                  <div className="admin-module-field">

                    <label>
                      Priority
                    </label>

                    <select
                      name="priority"
                      value={
                        moduleForm.priority
                      }
                      onChange={
                        handleModuleChange
                      }
                    >

                      <option value="LOW">
                        Low
                      </option>

                      <option value="MEDIUM">
                        Medium
                      </option>

                      <option value="HIGH">
                        High
                      </option>

                    </select>

                  </div>


                  <div className="admin-module-field">

                    <label>
                      Deadline
                    </label>

                    <input
                      type="date"
                      name="deadline"
                      value={
                        moduleForm.deadline
                      }
                      onChange={
                        handleModuleChange
                      }
                    />

                  </div>

                </div>


                {/* ACTIONS */}

                <div className="admin-module-form-actions">

                  <button
                    type="button"
                    className="admin-module-cancel"
                    disabled={
                      moduleSaving
                    }
                    onClick={() => {

                      resetModuleForm();

                      setShowModuleForm(
                        false
                      );

                    }}
                  >

                    Cancel

                  </button>


                  <button
                    type="submit"
                    className="admin-module-save"
                    disabled={
                      moduleSaving
                    }
                  >

                    {moduleSaving
                      ? "Creating..."
                      : "Create module"}

                  </button>

                </div>

              </form>

            )}


            {/* ==================================
                MODULE LIST
            ================================== */}

            <div className="admin-module-list">

              <div className="admin-module-list-title">

                <span>
                  ASSIGNED MODULES
                </span>

              </div>


              {modulesLoading ? (

                <div className="admin-module-empty">

                  Loading modules...

                </div>

              ) : modules.length === 0 ? (

                <div className="admin-module-empty">

                  <FolderKanban
                    size={28}
                    strokeWidth={1.3}
                  />

                  <strong>
                    No modules yet.
                  </strong>

                  <span>
                    Create the first module
                    and assign a developer.
                  </span>

                </div>

              ) : (

                modules.map(
                  module => (

                    <article
                      key={module.id}
                      className="admin-module-card"
                    >

                      <div className="admin-module-card-head">

                        <div>

                          <span>
                            MODULE /
                            {" "}
                            {String(
                              module.id
                            ).padStart(
                              3,
                              "0"
                            )}
                          </span>

                          <h3>
                            {module.moduleName}
                          </h3>

                        </div>


                        <span
                          className={
                            `admin-module-status ${
                              (
                                module.status ||
                                "ASSIGNED"
                              )
                                .toLowerCase()
                                .replaceAll(
                                  "_",
                                  "-"
                                )
                            }`
                          }
                        >

                          {formatStatus(
                            module.status
                          )}

                        </span>

                      </div>


                      {module.description && (

                        <p className="admin-module-description">

                          {
                            module.description
                          }

                        </p>

                      )}


                      <div className="admin-module-meta">

                        <div>

                          <UserRound
                            size={14}
                          />

                          <span>

                            {
                              module.developerName
                            }

                          </span>

                        </div>


                        <div>

                          <GitBranch
                            size={14}
                          />

                          <span>

                            {
                              module.branchName
                            }

                          </span>

                        </div>


                        <div>

                          <CalendarDays
                            size={14}
                          />

                          <span>

                            {formatDate(
                              module.deadline
                            )}

                          </span>

                        </div>

                      </div>


                      <div className="admin-module-card-footer">

                        <span
                          className={
                            `admin-module-priority ${
                              (
                                module.priority ||
                                "MEDIUM"
                              ).toLowerCase()
                            }`
                          }
                        >

                          {
                            module.priority ||
                            "MEDIUM"
                          }

                        </span>


                        <span>
                          Base:
                          {" "}
                          {
                            module.baseBranch ||
                            "develop"
                          }
                        </span>

                      </div>

                    </article>

                  )
                )

              )}

            </div>

          </aside>

        </div>

      )}


      {/* ========================================
          DELETE PROJECT CONFIRMATION
      ======================================== */}

      {projectToDelete && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background:
              "rgba(16, 16, 14, 0.46)",
            backdropFilter:
              "blur(3px)"
          }}
          onClick={() => {

            if (
              deletingProjectId === null
            ) {

              setProjectToDelete(
                null
              );

            }

          }}
        >

          <div
            style={{
              width: "min(430px, 100%)",
              padding: "32px",
              background: "#f3eee4",
              border:
                "1px solid rgba(25, 25, 22, 0.22)"
            }}
            onClick={
              event =>
                event.stopPropagation()
            }
          >

            <span
              style={{
                display: "block",
                marginBottom: "20px",
                fontSize: "9px",
                letterSpacing: "0.18em",
                color: "#824b42"
              }}
            >
              DELETE PROJECT
            </span>


            <h2
              style={{
                margin: "0 0 15px",
                fontSize: "30px",
                fontWeight: 500,
                letterSpacing: "-0.03em"
              }}
            >
              Are you sure?
            </h2>


            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.7
              }}
            >

              <strong>
                {projectToDelete.title}
              </strong>

              {" "}will be permanently deleted.

            </p>


            <small
              style={{
                display: "block",
                marginTop: "12px",
                fontSize: "11px",
                lineHeight: 1.6,
                opacity: 0.58
              }}
            >

              Assigned tasks and modules
              belonging to this project will
              also be removed.

            </small>


            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "30px"
              }}
            >

              <button
                type="button"
                disabled={
                  deletingProjectId !== null
                }
                onClick={() =>
                  setProjectToDelete(
                    null
                  )
                }
                style={{
                  minWidth: "95px",
                  padding: "11px 16px",
                  border:
                    "1px solid rgba(25, 25, 22, 0.25)",
                  background: "transparent",
                  color: "#1c1c19",
                  fontFamily: "inherit",
                  fontSize: "11px",
                  cursor:
                    deletingProjectId !== null
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    deletingProjectId !== null
                      ? 0.5
                      : 1
                }}
              >

                Cancel

              </button>


              <button
                type="button"
                disabled={
                  deletingProjectId !== null
                }
                onClick={
                  handleDeleteProject
                }
                style={{
                  minWidth: "95px",
                  padding: "11px 16px",
                  border:
                    "1px solid #7c4038",
                  background: "#7c4038",
                  color: "#f6f1e8",
                  fontFamily: "inherit",
                  fontSize: "11px",
                  cursor:
                    deletingProjectId !== null
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    deletingProjectId !== null
                      ? 0.5
                      : 1
                }}
              >

                {deletingProjectId !== null
                  ? "Deleting..."
                  : "Delete"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}


export default AdminProjects;