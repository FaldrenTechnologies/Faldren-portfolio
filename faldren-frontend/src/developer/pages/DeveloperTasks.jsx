import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  FolderKanban,
  GitBranch,
  CalendarDays,
  ExternalLink,
  Search,
  X,
  Send
} from "lucide-react";

import DeveloperSidebar
  from "../components/DeveloperSidebar";

import "../../admin/admin.css";


const API_BASE =
  "http://localhost:8080";


function DeveloperTasks() {

  // ==========================================
  // STATES
  // ==========================================

  const [modules, setModules] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [search, setSearch] =
    useState("");

  const [
    updatingModuleId,
    setUpdatingModuleId
  ] = useState(null);


  // ==========================================
  // REVIEW MODAL
  // ==========================================

  const [
    reviewModule,
    setReviewModule
  ] = useState(null);

  const [
    reviewSaving,
    setReviewSaving
  ] = useState(false);

  const [
    reviewError,
    setReviewError
  ] = useState("");

  const [
    reviewForm,
    setReviewForm
  ] = useState({
    pullRequestUrl: "",
    submissionSummary: "",
    testingNotes: ""
  });


  const developerName =
    localStorage.getItem(
      "developerName"
    ) || "Developer";


  // ==========================================
  // LOAD MODULES
  // ==========================================

  useEffect(() => {

    const loadModules =
      async () => {

        const token =
          localStorage.getItem(
            "developerToken"
          );


        if (!token) {

          window.location.href =
            "/developer/login";

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

            window.location.href =
              "/developer/login";

            return;
          }


          const data =
            await response.json();


          if (!response.ok) {

            setError(
              data.message ||
              "Unable to load tasks."
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
            "Task loading error:",
            error
          );


          setError(
            "Unable to connect to the backend."
          );


        } finally {

          setLoading(false);

        }

      };


    loadModules();

  }, []);


  // ==========================================
  // FILTER MODULES
  // ==========================================

  const filteredModules =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase();


      return modules.filter(
        module => {

          const matchesStatus =

            statusFilter === "ALL" ||

            module.status ===
              statusFilter;


          const matchesSearch =

            (
              module.moduleName ||
              ""
            )
              .toLowerCase()
              .includes(value) ||

            (
              module.projectTitle ||
              ""
            )
              .toLowerCase()
              .includes(value);


          return (
            matchesStatus &&
            matchesSearch
          );

        }
      );

    }, [
      modules,
      statusFilter,
      search
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
        return "No deadline";
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
  // START WORK
  // ASSIGNED -> IN_PROGRESS
  // ==========================================

  const handleStartWork =
    async moduleId => {

      const token =
        localStorage.getItem(
          "developerToken"
        );


      if (!token) {

        window.location.href =
          "/developer/login";

        return;
      }


      try {

        setUpdatingModuleId(
          moduleId
        );

        setError("");


        const response =
          await fetch(
            `${API_BASE}/api/developer/modules/${moduleId}/start`,
            {
              method: "PATCH",

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

          window.location.href =
            "/developer/login";

          return;
        }


        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.message ||
            "Unable to start work."
          );

          return;
        }


        setModules(
          current =>
            current.map(
              module =>
                module.id === moduleId
                  ? data
                  : module
            )
        );


      } catch (error) {

        console.error(
          "Start work error:",
          error
        );


        setError(
          "Unable to connect to the backend."
        );


      } finally {

        setUpdatingModuleId(
          null
        );

      }

    };


  // ==========================================
  // OPEN REVIEW MODAL
  // ==========================================

  const openReviewModal =
    module => {

      setReviewModule(
        module
      );

      setReviewError("");


      setReviewForm({

        pullRequestUrl:
          module.pullRequestUrl ||
          "",

        submissionSummary:
          "",

        testingNotes:
          ""

      });

    };


  // ==========================================
  // CLOSE REVIEW MODAL
  // ==========================================

  const closeReviewModal =
    () => {

      if (reviewSaving) {
        return;
      }


      setReviewModule(
        null
      );

      setReviewError("");


      setReviewForm({
        pullRequestUrl: "",
        submissionSummary: "",
        testingNotes: ""
      });

    };


  // ==========================================
  // REVIEW FORM CHANGE
  // ==========================================

  const handleReviewChange =
    event => {

      const {
        name,
        value
      } = event.target;


      setReviewForm(
        current => ({
          ...current,
          [name]: value
        })
      );

    };


  // ==========================================
  // SUBMIT FOR REVIEW
  // IN_PROGRESS -> IN_REVIEW
  // ==========================================

  const handleSubmitReview =
    async event => {

      event.preventDefault();


      if (!reviewModule) {
        return;
      }


      if (
        !reviewForm
          .pullRequestUrl
          .trim()
      ) {

        setReviewError(
          "Pull request URL is required."
        );

        return;
      }


      if (
        !reviewForm
          .submissionSummary
          .trim()
      ) {

        setReviewError(
          "Work summary is required."
        );

        return;
      }


      const token =
        localStorage.getItem(
          "developerToken"
        );


      if (!token) {

        window.location.href =
          "/developer/login";

        return;
      }


      try {

        setReviewSaving(
          true
        );

        setReviewError("");


        const response =
          await fetch(
            `${API_BASE}/api/developer/modules/${reviewModule.id}/submit-review`,
            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`

              },

              body:
                JSON.stringify({

                  pullRequestUrl:
                    reviewForm
                      .pullRequestUrl
                      .trim(),

                  submissionSummary:
                    reviewForm
                      .submissionSummary
                      .trim(),

                  testingNotes:
                    reviewForm
                      .testingNotes
                      .trim()

                })

            }
          );


        if (
          response.status === 401 ||
          response.status === 403
        ) {

          window.location.href =
            "/developer/login";

          return;
        }


        const data =
          await response.json();


        if (!response.ok) {

          setReviewError(
            data.message ||
            "Unable to submit module for review."
          );

          return;
        }


        setModules(
          current =>
            current.map(
              module =>
                module.id ===
                  reviewModule.id
                  ? data
                  : module
            )
        );


        closeReviewModal();


      } catch (error) {

        console.error(
          "Review submission error:",
          error
        );


        setReviewError(
          "Unable to connect to the backend."
        );


      } finally {

        setReviewSaving(
          false
        );

      }

    };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="admin-dashboard">

      <DeveloperSidebar />


      <main className="admin-main">


        {/* TOPBAR */}

        <header className="admin-topbar">

          <div>

            <span className="admin-page-label">
              FALDREN / DEVELOPER
            </span>

            <h1>
              My Tasks
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


        {/* INTRO */}

        <section className="admin-clients-intro">

          <div>

            <span className="admin-clients-kicker">
              ASSIGNED WORK
            </span>


            <h2>

              Your modules.
              <br />

              Your focus.

            </h2>


            <p>

              Manage assigned work,
              Git branches and review
              progress from one place.

            </p>

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
              placeholder="Search tasks..."
              value={search}
              onChange={
                event =>
                  setSearch(
                    event.target.value
                  )
              }
            />

          </div>


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
              All tasks
            </option>

            <option value="ASSIGNED">
              Assigned
            </option>

            <option value="IN_PROGRESS">
              In progress
            </option>

            <option value="IN_REVIEW">
              In review
            </option>

            <option value="CHANGES_REQUESTED">
              Changes requested
            </option>

            <option value="APPROVED">
              Approved
            </option>

            <option value="COMPLETED">
              Completed
            </option>

          </select>

        </section>


        {/* ERROR */}

        {error && (

          <div className="admin-project-api-error">
            {error}
          </div>

        )}


        {/* TASKS */}

        {loading ? (

          <div className="admin-module-empty">

            <strong>
              Loading tasks...
            </strong>

          </div>

        ) : filteredModules.length === 0 ? (

          <div className="admin-module-empty">

            <FolderKanban
              size={30}
            />

            <strong>
              No tasks found.
            </strong>

            <span>

              Assigned development
              modules will appear here.

            </span>

          </div>

        ) : (

          <div className="admin-module-list">

            {filteredModules.map(
              module => (

                <article
                  className="admin-module-card"
                  key={module.id}
                >


                  {/* HEADER */}

                  <div className="admin-module-card-head">

                    <div>

                      <span>

                        {
                          module.projectTitle
                        }
                        {" / MODULE "}
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


                  {/* DESCRIPTION */}

                  {module.description && (

                    <p className="admin-module-description">

                      {module.description}

                    </p>

                  )}


                  {/* META */}

                  <div className="admin-module-meta">

                    <div>

                      <GitBranch
                        size={14}
                      />

                      <span
                        title={
                          module.branchName
                        }
                      >

                        {
                          module.branchName ||
                          "No branch"
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


                    <div>

                      <FolderKanban
                        size={14}
                      />

                      <span>
                        {module.projectTitle}
                      </span>

                    </div>

                  </div>


                  {/* ACCEPTANCE CRITERIA */}

                  {module.acceptanceCriteria && (

                    <div
                      style={{
                        marginTop: "15px",
                        paddingTop: "14px",
                        borderTop:
                          "1px solid rgba(25, 25, 22, 0.14)"
                      }}
                    >

                      <span
                        style={{
                          display: "block",
                          marginBottom: "7px",
                          fontSize: "9px",
                          letterSpacing:
                            "0.12em",
                          opacity: 0.5
                        }}
                      >

                        ACCEPTANCE CRITERIA

                      </span>


                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          lineHeight: 1.6,
                          opacity: 0.7
                        }}
                      >

                        {
                          module
                            .acceptanceCriteria
                        }

                      </p>

                    </div>

                  )}


                  {/* ADMIN CHANGE REQUEST */}

                  {module.status ===
                    "CHANGES_REQUESTED" &&
                    module.reviewNotes && (

                    <div
                      style={{
                        marginTop: "15px",
                        padding: "14px",
                        border:
                          "1px solid rgba(132, 75, 63, 0.35)",
                        background:
                          "rgba(132, 75, 63, 0.04)"
                      }}
                    >

                      <span
                        style={{
                          display: "block",
                          marginBottom: "6px",
                          fontSize: "9px",
                          letterSpacing:
                            "0.12em",
                          color: "#844b3f"
                        }}
                      >

                        CHANGES REQUESTED

                      </span>


                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          lineHeight: 1.6
                        }}
                      >

                        {module.reviewNotes}

                      </p>

                    </div>

                  )}


                  {/* FOOTER */}

                  <div className="admin-module-card-footer">


                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                      }}
                    >

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


                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap"
                      }}
                    >


                      {/* REPOSITORY */}

                      {module.repoUrl && (

                        <a
                          href={
                            module.repoUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display:
                              "inline-flex",
                            alignItems:
                              "center",
                            gap: "5px",
                            color: "inherit",
                            textDecoration:
                              "none",
                            fontSize: "10px"
                          }}
                        >

                          Repository

                          <ExternalLink
                            size={12}
                          />

                        </a>

                      )}


                      {/* PR LINK */}

                      {module.pullRequestUrl && (

                        <a
                          href={
                            module.pullRequestUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display:
                              "inline-flex",
                            alignItems:
                              "center",
                            gap: "5px",
                            color: "inherit",
                            textDecoration:
                              "none",
                            fontSize: "10px"
                          }}
                        >

                          Pull Request

                          <ExternalLink
                            size={12}
                          />

                        </a>

                      )}


                      {/* START WORK */}

                      {module.status ===
                        "ASSIGNED" && (

                        <button
                          type="button"
                          className="developer-start-work-btn"
                          disabled={
                            updatingModuleId ===
                            module.id
                          }
                          onClick={() =>
                            handleStartWork(
                              module.id
                            )
                          }
                        >

                          {updatingModuleId ===
                          module.id
                            ? "Starting..."
                            : "Start Work"}

                        </button>

                      )}


                      {/* SUBMIT REVIEW */}

                      {(
                        module.status ===
                          "IN_PROGRESS" ||

                        module.status ===
                          "CHANGES_REQUESTED"
                      ) && (

                        <button
                          type="button"
                          className="developer-start-work-btn"
                          onClick={() =>
                            openReviewModal(
                              module
                            )
                          }
                        >

                          <Send
                            size={13}
                          />

                          {module.status ===
                          "CHANGES_REQUESTED"
                            ? "Resubmit"
                            : "Submit for Review"}

                        </button>

                      )}


                      {/* REVIEW STATUS */}

                      {module.status ===
                        "IN_REVIEW" && (

                        <span
                          style={{
                            padding:
                              "9px 12px",
                            border:
                              "1px solid rgba(115, 91, 52, 0.35)",
                            color:
                              "#735b34",
                            fontSize:
                              "9px",
                            letterSpacing:
                              "0.08em"
                          }}
                        >

                          WAITING FOR REVIEW

                        </span>

                      )}


                      {/* APPROVED */}

                      {module.status ===
                        "APPROVED" && (

                        <span
                          style={{
                            padding:
                              "9px 12px",
                            border:
                              "1px solid rgba(55, 98, 71, 0.35)",
                            color:
                              "#376247",
                            fontSize:
                              "9px",
                            letterSpacing:
                              "0.08em"
                          }}
                        >

                          APPROVED

                        </span>

                      )}


                      {/* COMPLETED */}

                      {module.status ===
                        "COMPLETED" && (

                        <span
                          style={{
                            padding:
                              "9px 12px",
                            border:
                              "1px solid rgba(55, 98, 71, 0.35)",
                            color:
                              "#376247",
                            fontSize:
                              "9px",
                            letterSpacing:
                              "0.08em"
                          }}
                        >

                          COMPLETED

                        </span>

                      )}

                    </div>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </main>


      {/* ======================================
          SUBMIT REVIEW MODAL
      ====================================== */}

      {reviewModule && (

        <div
          onClick={
            closeReviewModal
          }
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1500,
            display: "grid",
            placeItems: "center",
            padding: "20px",
            background:
              "rgba(18, 18, 16, 0.45)",
            backdropFilter:
              "blur(4px)"
          }}
        >

          <div
            onClick={
              event =>
                event.stopPropagation()
            }
            style={{
              width:
                "min(620px, 100%)",
              maxHeight:
                "90vh",
              overflowY: "auto",
              background:
                "#f5f2eb",
              border:
                "1px solid rgba(25,25,22,0.28)",
              boxShadow:
                "0 25px 70px rgba(0,0,0,0.18)"
            }}
          >


            {/* MODAL HEADER */}

            <div
              style={{
                padding:
                  "22px 24px",
                display: "flex",
                alignItems:
                  "flex-start",
                justifyContent:
                  "space-between",
                gap: "20px",
                borderBottom:
                  "1px solid rgba(25,25,22,0.18)"
              }}
            >

              <div>

                <span
                  style={{
                    display:
                      "block",
                    marginBottom:
                      "6px",
                    fontSize:
                      "9px",
                    letterSpacing:
                      "0.14em",
                    opacity: 0.55
                  }}
                >

                  SUBMIT FOR REVIEW

                </span>


                <h2
                  style={{
                    margin: 0,
                    fontSize:
                      "24px",
                    fontWeight:
                      500
                  }}
                >

                  {
                    reviewModule
                      .moduleName
                  }

                </h2>


                <p
                  style={{
                    margin:
                      "6px 0 0",
                    fontSize:
                      "12px",
                    opacity: 0.6
                  }}
                >

                  {
                    reviewModule
                      .projectTitle
                  }

                </p>

              </div>


              <button
                type="button"
                disabled={
                  reviewSaving
                }
                onClick={
                  closeReviewModal
                }
                style={{
                  width: "38px",
                  height: "38px",
                  display:
                    "grid",
                  placeItems:
                    "center",
                  border:
                    "1px solid rgba(25,25,22,0.2)",
                  background:
                    "transparent",
                  cursor:
                    "pointer"
                }}
              >

                <X
                  size={18}
                />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                handleSubmitReview
              }
              style={{
                padding:
                  "24px"
              }}
            >


              {reviewError && (

                <div
                  style={{
                    marginBottom:
                      "18px",
                    padding:
                      "12px 14px",
                    border:
                      "1px solid rgba(132,75,63,0.35)",
                    color:
                      "#844b3f",
                    fontSize:
                      "12px"
                  }}
                >

                  {reviewError}

                </div>

              )}


              {/* PR URL */}

              <div
                className="admin-module-field"
              >

                <label>
                  Pull Request URL *
                </label>

                <input
                  type="url"
                  name="pullRequestUrl"
                  placeholder="https://github.com/.../pull/12"
                  value={
                    reviewForm
                      .pullRequestUrl
                  }
                  onChange={
                    handleReviewChange
                  }
                  required
                />

              </div>


              {/* SUMMARY */}

              <div
                className="admin-module-field"
              >

                <label>
                  Work Summary *
                </label>

                <textarea
                  name="submissionSummary"
                  rows={4}
                  placeholder="Explain what you completed in this module..."
                  value={
                    reviewForm
                      .submissionSummary
                  }
                  onChange={
                    handleReviewChange
                  }
                  required
                />

              </div>


              {/* TESTING */}

              <div
                className="admin-module-field"
              >

                <label>
                  Testing Notes
                </label>

                <textarea
                  name="testingNotes"
                  rows={4}
                  placeholder="Mention what you tested, edge cases, known issues..."
                  value={
                    reviewForm
                      .testingNotes
                  }
                  onChange={
                    handleReviewChange
                  }
                />

              </div>


              {/* BRANCH INFO */}

              <div
                style={{
                  marginTop:
                    "8px",
                  padding:
                    "14px",
                  border:
                    "1px solid rgba(25,25,22,0.16)",
                  fontSize:
                    "11px"
                }}
              >

                <span
                  style={{
                    display:
                      "block",
                    marginBottom:
                      "5px",
                    fontSize:
                      "9px",
                    letterSpacing:
                      "0.1em",
                    opacity:
                      0.5
                  }}
                >

                  BRANCH

                </span>

                <strong
                  style={{
                    fontWeight:
                      500
                  }}
                >

                  {
                    reviewModule
                      .branchName
                  }

                </strong>

              </div>


              {/* BUTTONS */}

              <div
                style={{
                  marginTop:
                    "22px",
                  display:
                    "flex",
                  justifyContent:
                    "flex-end",
                  gap: "10px"
                }}
              >

                <button
                  type="button"
                  disabled={
                    reviewSaving
                  }
                  onClick={
                    closeReviewModal
                  }
                  style={{
                    minHeight:
                      "42px",
                    padding:
                      "0 18px",
                    border:
                      "1px solid rgba(25,25,22,0.25)",
                    background:
                      "transparent",
                    fontFamily:
                      "inherit",
                    cursor:
                      "pointer"
                  }}
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  disabled={
                    reviewSaving
                  }
                  className="developer-start-work-btn"
                  style={{
                    minHeight:
                      "42px"
                  }}
                >

                  <Send
                    size={13}
                  />

                  {reviewSaving
                    ? "Submitting..."
                    : "Submit for Review"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}


export default DeveloperTasks;