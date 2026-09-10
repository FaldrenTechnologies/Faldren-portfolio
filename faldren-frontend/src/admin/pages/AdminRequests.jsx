import React, { useMemo, useState } from "react";

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


const INITIAL_REQUESTS = [
  {
    id: 1,
    clientName: "Freddy Joshwa",
    companyName: "FJ Studio",
    email: "freddy@example.com",
    service: "Website",
    budget: "₹25,000 – ₹50,000",
    description:
      "We need a modern portfolio website with responsive design, project showcase and enquiry flow.",
    status: "PENDING",
    createdAt: "2026-09-08"
  },

  {
    id: 2,
    clientName: "Hariesh Kumar",
    companyName: "HK Technologies",
    email: "hariesh@example.com",
    service: "Web Application",
    budget: "₹50,000 – ₹1,00,000",
    description:
      "Looking for a business dashboard to manage internal operations and reports.",
    status: "PENDING",
    createdAt: "2026-09-09"
  },

  {
    id: 3,
    clientName: "Manesh Kumar",
    companyName: "Best Auto Consultancy",
    email: "manesh@example.com",
    service: "Website",
    budget: "Under ₹25,000",
    description:
      "Need a simple professional company website for our consultancy business.",
    status: "ACCEPTED",
    createdAt: "2026-09-05"
  }
];


function AdminRequests() {

  const [requests, setRequests] =
    useState(INITIAL_REQUESTS);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [selectedRequest, setSelectedRequest] =
    useState(null);


  const filteredRequests = useMemo(() => {

    const value =
      search.trim().toLowerCase();


    return requests.filter((request) => {

      const matchesSearch =
        request.clientName
          .toLowerCase()
          .includes(value) ||

        request.companyName
          .toLowerCase()
          .includes(value) ||

        request.service
          .toLowerCase()
          .includes(value) ||

        request.email
          .toLowerCase()
          .includes(value);


      const matchesStatus =
        statusFilter === "ALL" ||
        request.status === statusFilter;


      return (
        matchesSearch &&
        matchesStatus
      );

    });

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


  const updateRequestStatus = (
    id,
    status
  ) => {

    setRequests((current) =>

      current.map((request) =>

        request.id === id

          ? {
              ...request,
              status
            }

          : request

      )

    );


    setSelectedRequest((current) => {

      if (
        current &&
        current.id === id
      ) {

        return {
          ...current,
          status
        };

      }

      return current;

    });

  };


  return (

    <div className="admin-dashboard">

      <AdminSidebar />


      <main className="admin-main">


        {/* TOPBAR */}

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



        {/* SEARCH + FILTER */}

        <section className="admin-request-actions">

          <div className="admin-request-search">

            <Search
              size={17}
              strokeWidth={1.7}
            />

            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>


          <select
            className="admin-request-filter"
            value={statusFilter}
            onChange={(event) =>
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



        {/* TABLE */}

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

            {filteredRequests.length > 0 ? (

              filteredRequests.map(
                (request) => (

                  <article
                    className="admin-request-row"
                    key={request.id}
                  >


                    {/* CLIENT */}

                    <div className="admin-request-person">

                      <div className="admin-request-avatar">

                        {request.clientName
                          .charAt(0)
                          .toUpperCase()}

                      </div>


                      <div>

                        <strong>
                          {request.clientName}
                        </strong>

                        <span>
                          {request.companyName}
                        </span>

                      </div>

                    </div>



                    {/* SERVICE */}

                    <div className="admin-request-service">

                      {request.service}

                    </div>



                    {/* BUDGET */}

                    <div className="admin-request-budget">

                      {request.budget}

                    </div>



                    {/* DATE */}

                    <div className="admin-request-date">

                      <Clock3
                        size={13}
                        strokeWidth={1.5}
                      />

                      {request.createdAt}

                    </div>



                    {/* STATUS */}

                    <div>

                      <span
                        className={
                          `admin-request-status ${request.status.toLowerCase()}`
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


                      {request.status === "PENDING" && (

                        <>

                          <button
                            type="button"
                            className="admin-request-accept"
                            onClick={() =>
                              updateRequestStatus(
                                request.id,
                                "ACCEPTED"
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
                            onClick={() =>
                              updateRequestStatus(
                                request.id,
                                "REJECTED"
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



      {/* REQUEST DETAILS */}

      {selectedRequest && (

        <div
          className="admin-request-modal-backdrop"
          onClick={() =>
            setSelectedRequest(null)
          }
        >

          <aside
            className="admin-request-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-request-drawer-head">

              <div>

                <span>
                  REQUEST /
                  {" "}
                  {String(
                    selectedRequest.id
                  ).padStart(
                    3,
                    "0"
                  )}
                </span>

                <h2>
                  Project request
                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedRequest(null)
                }
              >

                <X size={20} />

              </button>

            </div>



            <div className="admin-request-detail-client">

              <div className="admin-request-detail-avatar">

                {selectedRequest.clientName
                  .charAt(0)
                  .toUpperCase()}

              </div>


              <div>

                <h3>
                  {selectedRequest.clientName}
                </h3>

                <p>
                  {selectedRequest.companyName}
                </p>

              </div>

            </div>



            <div className="admin-request-detail-grid">

              <div>

                <span>
                  SERVICE
                </span>

                <strong>
                  {selectedRequest.service}
                </strong>

              </div>


              <div>

                <span>
                  BUDGET
                </span>

                <strong>
                  {selectedRequest.budget}
                </strong>

              </div>


              <div>

                <span>
                  RECEIVED
                </span>

                <strong>
                  {selectedRequest.createdAt}
                </strong>

              </div>


              <div>

                <span>
                  STATUS
                </span>

                <strong>
                  {selectedRequest.status}
                </strong>

              </div>

            </div>



            <div className="admin-request-description">

              <span>
                PROJECT DESCRIPTION
              </span>

              <p>
                {selectedRequest.description}
              </p>

            </div>



            <a
              className="admin-request-contact"
              href={
                `mailto:${selectedRequest.email}`
              }
            >

              <Mail
                size={16}
                strokeWidth={1.6}
              />

              {selectedRequest.email}

            </a>



            {selectedRequest.status === "PENDING" && (

              <div className="admin-request-drawer-actions">

                <button
                  type="button"
                  className="admin-request-drawer-reject"
                  onClick={() =>
                    updateRequestStatus(
                      selectedRequest.id,
                      "REJECTED"
                    )
                  }
                >

                  <X size={16} />

                  Reject

                </button>


                <button
                  type="button"
                  className="admin-request-drawer-accept"
                  onClick={() =>
                    updateRequestStatus(
                      selectedRequest.id,
                      "ACCEPTED"
                    )
                  }
                >

                  <Check size={16} />

                  Accept request

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