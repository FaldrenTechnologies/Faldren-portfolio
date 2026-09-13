import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Search,
  Check,
  X,
  Mail,
  Eye,
  Clock3
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import "../admin.css";


const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");


function AdminRequests() {

  const [requests, setRequests] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(null);


  const adminName =
    localStorage.getItem("adminName") ||
    "Administrator";


  // ==========================================
  // LOAD REQUESTS FROM BACKEND
  // ==========================================

  const loadRequests = async () => {

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
          `${API_BASE}/api/admin/project-requests`,
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
          "Unable to load project requests."
        );

        return;
      }


      setRequests(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (error) {

      console.error(
        "Request loading error:",
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

    loadRequests();

  }, []);


  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredRequests =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase();


      return requests.filter(
        (request) => {

          const clientName =
            request.clientFullName || "";

          const companyName =
            request.clientCompany || "";

          const email =
            request.clientEmail || "";

          const service =
            request.serviceType || "";

          const projectName =
            request.projectName || "";


          const matchesSearch =

            clientName
              .toLowerCase()
              .includes(value) ||

            companyName
              .toLowerCase()
              .includes(value) ||

            email
              .toLowerCase()
              .includes(value) ||

            service
              .toLowerCase()
              .includes(value) ||

            projectName
              .toLowerCase()
              .includes(value);


          const matchesStatus =
            statusFilter === "ALL" ||
            request.status ===
              statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      requests,
      search,
      statusFilter
    ]);


  const pendingCount =
    requests.filter(
      (request) =>
        request.status === "PENDING"
    ).length;


  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate =
    (date) => {

      if (!date) {
        return "—";
      }


      const parsedDate =
        new Date(date);


      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return date;
      }


      return parsedDate
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
  // ACCEPT / REJECT
  // ==========================================

  const updateRequestStatus =
    async (
      request,
      action
    ) => {

      const token =
        localStorage.getItem(
          "adminToken"
        );


      if (!token) {

        window.location.href =
          "/admin/login";

        return;
      }


      setActionLoading(
        `${request.id}-${action}`
      );

      setError("");


      try {

        const response =
          await fetch(
            `${API_BASE}/api/admin/project-requests/${request.id}/${action}`,
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

          localStorage.removeItem(
            "adminToken"
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
            `Unable to ${action} request.`
          );

          return;
        }


        // Update UI immediately

        setRequests(
          (current) =>
            current.map(
              (item) =>

                item.id ===
                request.id

                  ? {
                      ...item,

                      status:
                        action ===
                        "accept"
                          ? "ACCEPTED"
                          : "REJECTED"
                    }

                  : item
            )
        );


        // Update drawer if open

        setSelectedRequest(
          (current) => {

            if (
              !current ||
              current.id !==
                request.id
            ) {

              return current;
            }


            return {
              ...current,

              status:
                action ===
                "accept"
                  ? "ACCEPTED"
                  : "REJECTED"
            };

          }
        );


        // Also refresh from DB

        await loadRequests();


      } catch (error) {

        console.error(
          "Request action error:",
          error
        );


        setError(
          "Unable to connect to the backend."
        );


      } finally {

        setActionLoading(
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


        {/* ================= TOPBAR ================= */}

        <header className="admin-topbar">

          <div>

            <span className="admin-page-label">
              FALDREN / ADMIN
            </span>

            <h1>
              Requests
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

        <section className="admin-requests-intro">

          <div>

            <span className="admin-requests-kicker">
              PROJECT REQUESTS
            </span>

            <h2>

              New ideas
              <br />

              <em>
                arrive here.
              </em>

            </h2>

            <p>
              Review project requests submitted
              by FALDREN clients.
            </p>

          </div>


          <div className="admin-request-count">

            <span>
              PENDING REQUESTS
            </span>

            <strong>

              {String(
                pendingCount
              ).padStart(
                2,
                "0"
              )}

            </strong>

          </div>

        </section>



        {/* ================= SEARCH + FILTER ================= */}

        <section className="admin-request-actions">

          <div className="admin-request-search">

            <Search
              size={17}
              strokeWidth={1.7}
            />

            <input
              type="text"
              placeholder="Search client or project..."
              value={search}
              onChange={
                (event) =>
                  setSearch(
                    event.target.value
                  )
              }
            />

          </div>


          <select
            className="admin-request-filter"
            value={statusFilter}
            onChange={
              (event) =>
                setStatusFilter(
                  event.target.value
                )
            }
          >

            <option value="ALL">
              All requests
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="ACCEPTED">
              Accepted
            </option>

            <option value="REJECTED">
              Rejected
            </option>

          </select>

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



        {/* ================= TABLE ================= */}

        <section className="admin-request-table">

          <div className="admin-request-table-head">

            <span>
              CLIENT
            </span>

            <span>
              SERVICE
            </span>

            <span>
              BUDGET
            </span>

            <span>
              RECEIVED
            </span>

            <span>
              STATUS
            </span>

            <span>
              ACTION
            </span>

          </div>


          <div className="admin-request-list">


            {loading ? (

              <div className="admin-request-empty">

                <span>
                  ...
                </span>

                <h3>
                  Loading requests.
                </h3>

                <p>
                  Fetching project requests
                  from FALDREN.
                </p>

              </div>

            ) : filteredRequests.length >
              0 ? (

              filteredRequests.map(
                (request) => (

                  <article
                    className="admin-request-row"
                    key={request.id}
                  >


                    {/* CLIENT */}

                    <div className="admin-request-person">

                      <div className="admin-request-avatar">

                        {(request.clientFullName ||
                          "C")
                          .charAt(0)
                          .toUpperCase()}

                      </div>


                      <div>

                        <strong>
                          {
                            request
                              .clientFullName
                          }
                        </strong>

                        <span>

                          {
                            request
                              .clientCompany ||
                            "Individual Client"
                          }

                        </span>

                      </div>

                    </div>



                    {/* SERVICE */}

                    <div className="admin-request-service">

                      {
                        request
                          .serviceType
                      }

                    </div>



                    {/* BUDGET */}

                    <div className="admin-request-budget">

                      {
                        request
                          .budgetRange
                      }

                    </div>



                    {/* RECEIVED */}

                    <div className="admin-request-date">

                      <Clock3
                        size={13}
                        strokeWidth={1.5}
                      />

                      {formatDate(
                        request.createdAt
                      )}

                    </div>



                    {/* STATUS */}

                    <div>

                      <span
                        className={
                          `admin-request-status ${
                            (
                              request.status ||
                              "PENDING"
                            )
                              .toLowerCase()
                          }`
                        }
                      >

                        <i />

                        {request.status}

                      </span>

                    </div>



                    {/* ACTIONS */}

                    <div className="admin-request-row-actions">


                      <button
                        type="button"
                        className="admin-request-view"
                        onClick={() =>
                          setSelectedRequest(
                            request
                          )
                        }
                        aria-label="View request"
                      >

                        <Eye
                          size={16}
                          strokeWidth={1.6}
                        />

                      </button>


                      {request.status ===
                        "PENDING" && (

                        <>

                          <button
                            type="button"
                            className="admin-request-accept"
                            disabled={
                              actionLoading !==
                              null
                            }
                            onClick={() =>
                              updateRequestStatus(
                                request,
                                "accept"
                              )
                            }
                            aria-label="Accept request"
                          >

                            <Check
                              size={15}
                              strokeWidth={1.8}
                            />

                          </button>


                          <button
                            type="button"
                            className="admin-request-reject"
                            disabled={
                              actionLoading !==
                              null
                            }
                            onClick={() =>
                              updateRequestStatus(
                                request,
                                "reject"
                              )
                            }
                            aria-label="Reject request"
                          >

                            <X
                              size={15}
                              strokeWidth={1.8}
                            />

                          </button>

                        </>

                      )}

                    </div>

                  </article>

                )
              )

            ) : (

              <div className="admin-request-empty">

                <span>
                  00
                </span>

                <h3>
                  No requests found.
                </h3>

                <p>
                  Try another search
                  or status filter.
                </p>

              </div>

            )}

          </div>

        </section>

      </main>



      {/* =================================================
          REQUEST DETAILS DRAWER
      ================================================= */}

      {selectedRequest && (

        <div
          className="admin-request-modal-backdrop"
          onClick={() =>
            setSelectedRequest(
              null
            )
          }
        >

          <aside
            className="admin-request-drawer"
            onClick={
              (event) =>
                event.stopPropagation()
            }
          >


            <div className="admin-request-drawer-head">

              <div>

                <span>

                  REQUEST /{" "}

                  {String(
                    selectedRequest.id
                  ).padStart(
                    3,
                    "0"
                  )}

                </span>


                <h2>

                  {
                    selectedRequest
                      .projectName
                  }

                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedRequest(
                    null
                  )
                }
              >

                <X size={20} />

              </button>

            </div>



            {/* CLIENT */}

            <div className="admin-request-detail-client">

              <div className="admin-request-detail-avatar">

                {(selectedRequest
                  .clientFullName ||
                  "C")
                  .charAt(0)
                  .toUpperCase()}

              </div>


              <div>

                <h3>
                  {
                    selectedRequest
                      .clientFullName
                  }
                </h3>

                <p>

                  {
                    selectedRequest
                      .clientCompany ||
                    "Individual Client"
                  }

                </p>

              </div>

            </div>



            {/* BASIC DETAILS */}

            <div className="admin-request-detail-grid">


              <div>

                <span>
                  SERVICE
                </span>

                <strong>
                  {
                    selectedRequest
                      .serviceType
                  }
                </strong>

              </div>


              <div>

                <span>
                  BUDGET
                </span>

                <strong>
                  {
                    selectedRequest
                      .budgetRange
                  }
                </strong>

              </div>


              <div>

                <span>
                  EXPECTED DEADLINE
                </span>

                <strong>

                  {formatDate(
                    selectedRequest
                      .expectedDeadline
                  )}

                </strong>

              </div>


              <div>

                <span>
                  STATUS
                </span>

                <strong>
                  {
                    selectedRequest
                      .status
                  }
                </strong>

              </div>

            </div>



            {/* PROJECT DESCRIPTION */}

            <div className="admin-request-description">

              <span>
                PROJECT DESCRIPTION
              </span>

              <p>
                {
                  selectedRequest
                    .description
                }
              </p>

            </div>



            {/* REQUIREMENTS */}

            <div className="admin-request-description">

              <span>
                MAIN REQUIREMENTS / FEATURES
              </span>

              <p
                style={{
                  whiteSpace:
                    "pre-wrap"
                }}
              >
                {
                  selectedRequest
                    .requirements
                }
              </p>

            </div>



            {/* BUSINESS GOAL */}

            <div className="admin-request-description">

              <span>
                BUSINESS GOAL
              </span>

              <p
                style={{
                  whiteSpace:
                    "pre-wrap"
                }}
              >
                {
                  selectedRequest
                    .businessGoal
                }
              </p>

            </div>



            {/* REFERENCES */}

            {selectedRequest
              .referenceLinks && (

              <div className="admin-request-description">

                <span>
                  REFERENCES / INSPIRATION
                </span>

                <p
                  style={{
                    whiteSpace:
                      "pre-wrap"
                  }}
                >
                  {
                    selectedRequest
                      .referenceLinks
                  }
                </p>

              </div>

            )}



            {/* NOTES */}

            {selectedRequest
              .additionalNotes && (

              <div className="admin-request-description">

                <span>
                  ADDITIONAL NOTES
                </span>

                <p
                  style={{
                    whiteSpace:
                      "pre-wrap"
                  }}
                >
                  {
                    selectedRequest
                      .additionalNotes
                  }
                </p>

              </div>

            )}



            {/* CONTACT EMAIL */}

            <a
              className="admin-request-contact"
              href={
                `mailto:${
                  selectedRequest
                    .clientEmail
                }`
              }
            >

              <Mail
                size={16}
                strokeWidth={1.6}
              />

              {
                selectedRequest
                  .clientEmail
              }

            </a>



            {/* PHONE */}

            {selectedRequest
              .clientPhone && (

              <div
                className="admin-request-description"
                style={{
                  marginTop:
                    "18px"
                }}
              >

                <span>
                  PHONE
                </span>

                <p>
                  {
                    selectedRequest
                      .clientPhone
                  }
                </p>

              </div>

            )}



            {/* ACCEPT / REJECT */}

            {selectedRequest.status ===
              "PENDING" && (

              <div className="admin-request-drawer-actions">

                <button
                  type="button"
                  className="admin-request-drawer-reject"
                  disabled={
                    actionLoading !==
                    null
                  }
                  onClick={() =>
                    updateRequestStatus(
                      selectedRequest,
                      "reject"
                    )
                  }
                >

                  <X size={16} />

                  {actionLoading ===
                    `${selectedRequest.id}-reject`
                    ? "Rejecting..."
                    : "Reject"}

                </button>


                <button
                  type="button"
                  className="admin-request-drawer-accept"
                  disabled={
                    actionLoading !==
                    null
                  }
                  onClick={() =>
                    updateRequestStatus(
                      selectedRequest,
                      "accept"
                    )
                  }
                >

                  <Check size={16} />

                  {actionLoading ===
                    `${selectedRequest.id}-accept`
                    ? "Accepting..."
                    : "Accept request"}

                </button>

              </div>

            )}

          </aside>

        </div>

      )}

    </div>

  );

}


export default AdminRequests;