import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import "../admin.css";


const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");


function AdminClients() {

  const [search, setSearch] =
    useState("");

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
  // LOAD REAL CLIENTS
  // ==========================================

  const loadClients =
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
            `${API_BASE}/api/admin/clients`,
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

          localStorage.removeItem(
            "adminLoggedIn"
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
            "Unable to load clients."
          );

          return;
        }


        setClients(
          Array.isArray(data)
            ? data
            : []
        );


      } catch (error) {

        console.error(
          "Client loading error:",
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

    loadClients();

  }, []);


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredClients =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase();


      if (!value) {
        return clients;
      }


      return clients.filter(
        (client) => {

          const fullName =
            client.fullName || "";

          const companyName =
            client.companyName || "";

          const email =
            client.email || "";

          const phone =
            client.phone || "";


          return (

            fullName
              .toLowerCase()
              .includes(value) ||

            companyName
              .toLowerCase()
              .includes(value) ||

            email
              .toLowerCase()
              .includes(value) ||

            phone
              .toLowerCase()
              .includes(value)

          );

        }
      );

    }, [
      clients,
      search
    ]);


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
              Clients
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

        <section className="admin-clients-intro">

          <div>

            <span className="admin-clients-kicker">
              CLIENT DIRECTORY
            </span>

            <h2>
              People behind
              <br />
              the projects.
            </h2>

            <p>
              View and manage clients working
              with FALDREN.
            </p>

          </div>


          <div className="admin-client-count">

            <span>
              TOTAL CLIENTS
            </span>

            <strong>

              {String(
                clients.length
              ).padStart(
                2,
                "0"
              )}

            </strong>

          </div>

        </section>



        {/* ================= ACTIONS ================= */}

        <section className="admin-client-actions">

          <div className="admin-client-search">

            <Search
              size={17}
              strokeWidth={1.7}
            />

            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={
                (event) =>
                  setSearch(
                    event.target.value
                  )
              }
            />

          </div>


          <button
            className="admin-add-client"
            type="button"
            disabled
            title="Client creation from admin will be added next"
          >

            <Plus
              size={17}
              strokeWidth={1.8}
            />

            Add client

          </button>

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



        {/* ================= TABLE ================= */}

        <section className="admin-clients-table-wrap">

          <div className="admin-clients-table-head">

            <span>
              CLIENT
            </span>

            <span>
              COMPANY
            </span>

            <span>
              CONTACT
            </span>

            <span>
              STATUS
            </span>

            <span>
              ACTION
            </span>

          </div>


          <div className="admin-clients-list">


            {loading ? (

              <div className="admin-client-empty">

                <span>
                  ...
                </span>

                <h3>
                  Loading clients.
                </h3>

                <p>
                  Fetching registered FALDREN
                  clients.
                </p>

              </div>

            ) : filteredClients.length >
              0 ? (

              filteredClients.map(
                (client, index) => (

                  <article
                    className="admin-client-row"
                    key={client.id}
                  >


                    {/* CLIENT */}

                    <div className="admin-client-person">

                      <div className="admin-client-avatar">

                        {(client.fullName || "C")
                          .charAt(0)
                          .toUpperCase()}

                      </div>


                      <div>

                        <strong>
                          {client.fullName}
                        </strong>

                        <span>

                          CLIENT /{" "}

                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}

                        </span>

                      </div>

                    </div>



                    {/* COMPANY */}

                    <div className="admin-client-company">

                      {client.companyName ||
                        "Individual Client"}

                    </div>



                    {/* CONTACT */}

                    <div className="admin-client-contact">

                      <span>

                        <Mail
                          size={13}
                          strokeWidth={1.6}
                        />

                        {client.email}

                      </span>


                      <span>

                        <Phone
                          size={13}
                          strokeWidth={1.6}
                        />

                        {client.phone ||
                          "Not provided"}

                      </span>

                    </div>



                    {/* STATUS */}

                    <div>

                      <span className="admin-client-status active">

                        <i />

                        ACTIVE

                      </span>

                    </div>



                    {/* ACTION */}

                    <div className="admin-client-menu">

                      <button
                        type="button"
                        aria-label="Client actions"
                        title="Client management will be added next"
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

              <div className="admin-client-empty">

                <span>
                  00
                </span>

                <h3>
                  No clients found.
                </h3>

                <p>
                  Try another name,
                  company or email.
                </p>

              </div>

            )}

          </div>

        </section>

      </main>

    </div>

  );

}


export default AdminClients;