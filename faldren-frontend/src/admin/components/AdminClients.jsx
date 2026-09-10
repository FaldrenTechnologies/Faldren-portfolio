import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone
} from "lucide-react";

import AdminSidebar from "./AdminSidebar";
import "../admin.css";


function AdminClients() {

  const [search, setSearch] = useState("");


  // TEMPORARY FRONTEND DATA
  // Later Spring Boot API-lendhu varum
  const clients = [
    {
      id: 1,
      fullName: "Freddy Joshwa",
      companyName: "FJ Studio",
      email: "freddy@example.com",
      phone: "+91 98765 43210",
      status: "ACTIVE"
    },
    {
      id: 2,
      fullName: "Hariesh Kumar",
      companyName: "HK Technologies",
      email: "hariesh@example.com",
      phone: "+91 98765 12345",
      status: "ACTIVE"
    },
    {
      id: 3,
      fullName: "Manesh Kumar",
      companyName: "Best Auto Consultancy",
      email: "manesh@example.com",
      phone: "+91 98765 56789",
      status: "INACTIVE"
    }
  ];


  const filteredClients = useMemo(() => {

    const value =
      search.trim().toLowerCase();

    if (!value) {
      return clients;
    }

    return clients.filter((client) => {

      return (
        client.fullName
          .toLowerCase()
          .includes(value) ||

        client.companyName
          .toLowerCase()
          .includes(value) ||

        client.email
          .toLowerCase()
          .includes(value)
      );

    });

  }, [search]);


  return (
    <div className="admin-dashboard">

      <AdminSidebar />


      <main className="admin-main">

        {/* HEADER */}

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



        {/* PAGE INTRO */}

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
              {String(clients.length)
                .padStart(2, "0")}
            </strong>

          </div>

        </section>



        {/* ACTION BAR */}

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
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <button
            className="admin-add-client"
            type="button"
          >

            <Plus
              size={17}
              strokeWidth={1.8}
            />

            Add client

          </button>

        </section>



        {/* CLIENT TABLE */}

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

            {filteredClients.length > 0 ? (

              filteredClients.map(
                (client, index) => (

                  <article
                    className="admin-client-row"
                    key={client.id}
                  >

                    {/* CLIENT */}

                    <div className="admin-client-person">

                      <div className="admin-client-avatar">

                        {client.fullName
                          .charAt(0)
                          .toUpperCase()}

                      </div>


                      <div>

                        <strong>
                          {client.fullName}
                        </strong>

                        <span>
                          CLIENT /
                          {" "}
                          {String(index + 1)
                            .padStart(2, "0")}
                        </span>

                      </div>

                    </div>



                    {/* COMPANY */}

                    <div className="admin-client-company">

                      {client.companyName}

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

                        {client.phone}

                      </span>

                    </div>



                    {/* STATUS */}

                    <div>

                      <span
                        className={
                          client.status === "ACTIVE"
                            ? "admin-client-status active"
                            : "admin-client-status inactive"
                        }
                      >

                        <i />

                        {client.status}

                      </span>

                    </div>



                    {/* ACTION */}

                    <div className="admin-client-menu">

                      <button
                        type="button"
                        aria-label="Client actions"
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