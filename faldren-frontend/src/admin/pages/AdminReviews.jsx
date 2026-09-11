import React, {
  useEffect,
  useState
} from "react";

import {
  GitPullRequest,
  ExternalLink,
  User,
  GitBranch,
  CalendarDays,
  Check,
  RotateCcw,
  X
} from "lucide-react";

import AdminSidebar
  from "../components/AdminSidebar";

import "../admin.css";


const API_BASE =
  "http://localhost:8080";


function AdminReviews() {

  const [modules, setModules] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    actionModuleId,
    setActionModuleId
  ] = useState(null);


  const [
    changeModule,
    setChangeModule
  ] = useState(null);

  const [
    reviewNotes,
    setReviewNotes
  ] = useState("");

  const [
    changeError,
    setChangeError
  ] = useState("");


  const adminName =
    localStorage.getItem(
      "adminName"
    ) || "Admin";


  // ==========================================
  // LOAD REVIEW QUEUE
  // ==========================================

  const loadReviews =
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
            `${API_BASE}/api/admin/module-reviews`,
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
            "/admin/login";

          return;
        }


        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.message ||
            "Unable to load review queue."
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
          "Review queue error:",
          error
        );


        setError(
          "Unable to connect to backend."
        );


      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    loadReviews();

  }, []);


  // ==========================================
  // APPROVE
  // ==========================================

  const handleApprove =
    async moduleId => {

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

        setActionModuleId(
          moduleId
        );

        setError("");


        const response =
          await fetch(
            `${API_BASE}/api/admin/module-reviews/${moduleId}/approve`,
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
            "/admin/login";

          return;
        }


        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.message ||
            "Unable to approve module."
          );

          return;
        }


        // Remove approved module from queue

        setModules(
          current =>
            current.filter(
              module =>
                module.id !==
                moduleId
            )
        );


      } catch (error) {

        console.error(
          "Approve error:",
          error
        );


        setError(
          "Unable to connect to backend."
        );


      } finally {

        setActionModuleId(
          null
        );

      }

    };


  // ==========================================
  // OPEN REQUEST CHANGES
  // ==========================================

  const openChangesModal =
    module => {

      setChangeModule(
        module
      );

      setReviewNotes("");

      setChangeError("");

    };


  const closeChangesModal =
    () => {

      if (actionModuleId) {
        return;
      }


      setChangeModule(
        null
      );

      setReviewNotes("");

      setChangeError("");

    };


  // ==========================================
  // REQUEST CHANGES
  // ==========================================

  const handleRequestChanges =
    async event => {

      event.preventDefault();


      if (!changeModule) {
        return;
      }


      if (!reviewNotes.trim()) {

        setChangeError(
          "Review notes are required."
        );

        return;
      }


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

        setActionModuleId(
          changeModule.id
        );

        setChangeError("");


        const response =
          await fetch(
            `${API_BASE}/api/admin/module-reviews/${changeModule.id}/request-changes`,
            {
              method: "PATCH",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`

              },

              body:
                JSON.stringify({
                  reviewNotes:
                    reviewNotes.trim()
                })
            }
          );


        if (
          response.status === 401 ||
          response.status === 403
        ) {

          window.location.href =
            "/admin/login";

          return;
        }


        const data =
          await response.json();


        if (!response.ok) {

          setChangeError(
            data.message ||
            "Unable to request changes."
          );

          return;
        }


        setModules(
          current =>
            current.filter(
              module =>
                module.id !==
                changeModule.id
            )
        );


        setChangeModule(
          null
        );

        setReviewNotes("");


      } catch (error) {

        console.error(
          "Request changes error:",
          error
        );


        setChangeError(
          "Unable to connect to backend."
        );


      } finally {

        setActionModuleId(
          null
        );

      }

    };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate =
    date => {

      if (!date) {
        return "No deadline";
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


  return (

    <div className="admin-dashboard">

      <AdminSidebar />


      <main className="admin-main">


        {/* ======================================
            HEADER
        ====================================== */}

        <header className="admin-topbar">

          <div>

            <span className="admin-page-label">
              FALDREN / ADMIN
            </span>

            <h1>
              Reviews
            </h1>

          </div>


          <div className="admin-profile">

            <div className="admin-profile-copy">

              <strong>
                {adminName}
              </strong>

              <span>
                ADMIN
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

        <section className="admin-clients-intro">

          <div>

            <span className="admin-clients-kicker">
              CODE REVIEW
            </span>

            <h2>

              Review.
              <br />

              Approve.
              <br />

              Ship.

            </h2>


            <p>

              Review developer submissions,
              inspect pull requests and
              request changes when needed.

            </p>

          </div>

        </section>


        {/* ======================================
            QUEUE COUNT
        ====================================== */}

        <section
          style={{
            marginBottom: "24px",
            padding: "18px 20px",
            border:
              "1px solid rgba(25,25,22,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between"
          }}
        >

          <div>

            <span
              style={{
                display: "block",
                fontSize: "9px",
                letterSpacing: "0.12em",
                opacity: 0.55
              }}
            >
              REVIEW QUEUE
            </span>

            <strong
              style={{
                display: "block",
                marginTop: "6px",
                fontSize: "20px",
                fontWeight: 500
              }}
            >

              {loading
                ? "--"
                : `${modules.length} ${
                    modules.length === 1
                      ? "module"
                      : "modules"
                  } waiting`}

            </strong>

          </div>


          <GitPullRequest
            size={24}
            strokeWidth={1.4}
          />

        </section>


        {/* ERROR */}

        {error && (

          <div className="admin-project-api-error">
            {error}
          </div>

        )}


        {/* ======================================
            REVIEW LIST
        ====================================== */}

        {loading ? (

          <div className="admin-module-empty">

            Loading review queue...

          </div>

        ) : modules.length === 0 ? (

          <div className="admin-module-empty">

            <GitPullRequest
              size={30}
            />

            <strong>
              Review queue is clear.
            </strong>

            <span>
              Developer submissions will
              appear here.
            </span>

          </div>

        ) : (

          <div className="admin-module-list">

            {modules.map(
              module => (

                <article
                  key={module.id}
                  className="admin-module-card"
                >


                  {/* HEADER */}

                  <div className="admin-module-card-head">

                    <div>

                      <span>

                        {module.projectTitle}

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


                    <span className="admin-module-status in-review">

                      IN REVIEW

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

                      <User
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


                  {/* DEVELOPER */}

                  <div
                    style={{
                      marginTop: "18px",
                      padding: "14px",
                      border:
                        "1px solid rgba(25,25,22,0.14)"
                    }}
                  >

                    <span
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontSize: "9px",
                        letterSpacing:
                          "0.12em",
                        opacity: 0.5
                      }}
                    >

                      DEVELOPER

                    </span>


                    <strong
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 500
                      }}
                    >

                      {
                        module.developerName
                      }

                    </strong>


                    <span
                      style={{
                        display: "block",
                        marginTop: "3px",
                        fontSize: "11px",
                        opacity: 0.55
                      }}
                    >

                      {
                        module.developerEmail
                      }

                    </span>

                  </div>


                  {/* WORK SUMMARY */}

                  <div
                    style={{
                      marginTop: "14px",
                      padding: "14px",
                      border:
                        "1px solid rgba(25,25,22,0.14)"
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

                      WORK SUMMARY

                    </span>


                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        lineHeight: 1.6
                      }}
                    >

                      {
                        module.submissionSummary ||
                        "No summary provided."
                      }

                    </p>

                  </div>


                  {/* TESTING NOTES */}

                  <div
                    style={{
                      marginTop: "10px",
                      padding: "14px",
                      border:
                        "1px solid rgba(25,25,22,0.14)"
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

                      TESTING NOTES

                    </span>


                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        lineHeight: 1.6
                      }}
                    >

                      {
                        module.testingNotes ||
                        "No testing notes provided."
                      }

                    </p>

                  </div>


                  {/* ACCEPTANCE */}

                  {module.acceptanceCriteria && (

                    <div
                      style={{
                        marginTop: "10px",
                        padding: "14px",
                        border:
                          "1px solid rgba(25,25,22,0.14)"
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
                          lineHeight: 1.6
                        }}
                      >

                        {
                          module.acceptanceCriteria
                        }

                      </p>

                    </div>

                  )}


                  {/* FOOTER */}

                  <div
                    className="admin-module-card-footer"
                    style={{
                      marginTop: "18px"
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        flexWrap: "wrap"
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
                        gap: "10px",
                        alignItems: "center",
                        flexWrap: "wrap"
                      }}
                    >


                      {/* REPO */}

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


                      {/* PR */}

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


                      {/* REQUEST CHANGES */}

                      <button
                        type="button"
                        disabled={
                          actionModuleId ===
                          module.id
                        }
                        onClick={() =>
                          openChangesModal(
                            module
                          )
                        }
                        style={{
                          minHeight: "38px",
                          padding:
                            "0 14px",
                          border:
                            "1px solid rgba(25,25,22,0.3)",
                          background:
                            "transparent",
                          fontFamily:
                            "inherit",
                          fontSize:
                            "10px",
                          cursor:
                            "pointer",
                          display:
                            "inline-flex",
                          alignItems:
                            "center",
                          gap: "6px"
                        }}
                      >

                        <RotateCcw
                          size={13}
                        />

                        Request Changes

                      </button>


                      {/* APPROVE */}

                      <button
                        type="button"
                        className="developer-start-work-btn"
                        disabled={
                          actionModuleId ===
                          module.id
                        }
                        onClick={() =>
                          handleApprove(
                            module.id
                          )
                        }
                      >

                        <Check
                          size={13}
                        />

                        {actionModuleId ===
                        module.id
                          ? "Processing..."
                          : "Approve"}

                      </button>

                    </div>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </main>


      {/* ======================================
          REQUEST CHANGES MODAL
      ====================================== */}

      {changeModule && (

        <div
          onClick={
            closeChangesModal
          }
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "grid",
            placeItems: "center",
            padding: "20px",
            background:
              "rgba(18,18,16,0.45)",
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
                "min(560px, 100%)",
              background:
                "#f5f2eb",
              border:
                "1px solid rgba(25,25,22,0.28)"
            }}
          >


            {/* HEADER */}

            <div
              style={{
                padding: "22px",
                borderBottom:
                  "1px solid rgba(25,25,22,0.18)",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-start"
              }}
            >

              <div>

                <span className="admin-clients-kicker">
                  REQUEST CHANGES
                </span>


                <h2
                  style={{
                    margin:
                      "7px 0 0",
                    fontSize:
                      "22px",
                    fontWeight:
                      500
                  }}
                >

                  {
                    changeModule.moduleName
                  }

                </h2>

              </div>


              <button
                type="button"
                onClick={
                  closeChangesModal
                }
                style={{
                  width: "36px",
                  height: "36px",
                  display: "grid",
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
                  size={17}
                />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                handleRequestChanges
              }
              style={{
                padding: "22px"
              }}
            >

              {changeError && (

                <div className="admin-project-api-error">

                  {changeError}

                </div>

              )}


              <div className="admin-module-field">

                <label>
                  Review Notes *
                </label>


                <textarea
                  rows={6}
                  placeholder="Explain clearly what needs to be fixed..."
                  value={reviewNotes}
                  onChange={
                    event =>
                      setReviewNotes(
                        event.target.value
                      )
                  }
                  required
                />

              </div>


              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  gap: "10px"
                }}
              >

                <button
                  type="button"
                  onClick={
                    closeChangesModal
                  }
                  style={{
                    minHeight: "40px",
                    padding:
                      "0 16px",
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
                  className="developer-start-work-btn"
                  disabled={
                    actionModuleId ===
                    changeModule.id
                  }
                >

                  <RotateCcw
                    size={13}
                  />

                  {actionModuleId ===
                  changeModule.id
                    ? "Sending..."
                    : "Request Changes"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}


export default AdminReviews;