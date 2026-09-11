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
  Phone,
  X,
  Eye,
  EyeOff
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import "../admin.css";


const API_BASE =
  "http://localhost:8080";


function AdminDevelopers() {

  const [developers, setDevelopers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showAddDeveloper, setShowAddDeveloper] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [form, setForm] =
    useState({
      fullName: "",
      email: "",
      phone: "",
      password: ""
    });


  const adminName =
    localStorage.getItem(
      "adminName"
    ) || "Administrator";


  // ==========================================
  // LOAD DEVELOPERS
  // ==========================================

  const loadDevelopers =
    async () => {

      const token =
        localStorage.getItem(
          "adminToken"
        );

      if (!token) {
        setLoading(false);
        return;
      }


      try {

        setLoading(true);
        setError("");


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


        if (!response.ok) {

          throw new Error(
            "Unable to load developers."
          );

        }


        const data =
          await response.json();


        setDevelopers(
          Array.isArray(data)
            ? data
            : []
        );


      } catch (error) {

        console.error(
          "Load developers error:",
          error
        );

        setError(
          "Unable to load developers."
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    loadDevelopers();

  }, []);



  // ==========================================
  // SEARCH
  // ==========================================

  const filteredDevelopers =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase();


      if (!value) {
        return developers;
      }


      return developers.filter(
        (developer) => {

          return (

            developer.fullName
              ?.toLowerCase()
              .includes(value) ||

            developer.email
              ?.toLowerCase()
              .includes(value) ||

            developer.phone
              ?.toLowerCase()
              .includes(value)

          );

        }
      );

    }, [
      search,
      developers
    ]);



  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setForm(
      current => ({
        ...current,
        [name]: value
      })
    );

  };



  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {

    setForm({
      fullName: "",
      email: "",
      phone: "",
      password: ""
    });

    setShowPassword(false);

  };



  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {

    if (creating) {
      return;
    }

    setShowAddDeveloper(false);

    resetForm();

    setError("");

  };



  // ==========================================
  // CREATE DEVELOPER
  // ==========================================

  const handleCreateDeveloper =
    async (e) => {

      e.preventDefault();

      setError("");
      setCreating(true);


      const token =
        localStorage.getItem(
          "adminToken"
        );


      try {

        const response =
          await fetch(
            `${API_BASE}/api/admin/developers`,
            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`

              },

              body: JSON.stringify({

                fullName:
                  form.fullName.trim(),

                email:
                  form.email.trim(),

                phone:
                  form.phone.trim(),

                password:
                  form.password

              })

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.message ||
            "Unable to create developer."
          );

          return;

        }


        // Add immediately to UI

        setDevelopers(
          current => [
            data,
            ...current
          ]
        );


        resetForm();

        setShowAddDeveloper(
          false
        );


      } catch (error) {

        console.error(
          "Create developer error:",
          error
        );


        setError(
          "Unable to connect to the server."
        );


      } finally {

        setCreating(false);

      }

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
              Developers
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
            PAGE INTRO
        ====================================== */}

        <section className="admin-clients-intro">

          <div>

            <span className="admin-clients-kicker">
              DEVELOPMENT TEAM
            </span>


            <h2>

              People building
              <br />

              the product.

            </h2>


            <p>

              Create developer accounts,
              manage access and assign
              project modules.

            </p>

          </div>


          <div className="admin-client-count">

            <span>
              TOTAL DEVELOPERS
            </span>

            <strong>

              {String(
                developers.length
              ).padStart(
                2,
                "0"
              )}

            </strong>

          </div>

        </section>



        {/* ======================================
            ACTION BAR
        ====================================== */}

        <section className="admin-client-actions">

          <div className="admin-client-search">

            <Search
              size={17}
              strokeWidth={1.7}
            />


            <input
              type="text"
              placeholder="Search developers..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>


          <button
            className="admin-add-client"
            type="button"
            onClick={() => {

              setError("");

              setShowAddDeveloper(
                true
              );

            }}
          >

            <Plus
              size={17}
              strokeWidth={1.8}
            />

            Add developer

          </button>

        </section>



        {/* ======================================
            ERROR
        ====================================== */}

        {error && !showAddDeveloper && (

          <div className="admin-developer-error">

            {error}

          </div>

        )}



        {/* ======================================
            DEVELOPERS TABLE
        ====================================== */}

        <section className="admin-clients-table-wrap">

          <div className="admin-clients-table-head">

            <span>
              DEVELOPER
            </span>

            <span>
              ACCESS
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
                  --
                </span>

                <h3>
                  Loading developers...
                </h3>

              </div>

            ) : filteredDevelopers.length > 0 ? (

              filteredDevelopers.map(
                (developer, index) => (

                  <article
                    className="admin-client-row"
                    key={developer.id}
                  >


                    {/* DEVELOPER */}

                    <div className="admin-client-person">

                      <div className="admin-client-avatar">

                        {developer.fullName
                          ?.charAt(0)
                          .toUpperCase()}

                      </div>


                      <div>

                        <strong>
                          {developer.fullName}
                        </strong>


                        <span>

                          DEVELOPER /
                          {" "}

                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}

                        </span>

                      </div>

                    </div>



                    {/* ACCESS */}

                    <div className="admin-client-company">

                      {developer.mustChangePassword
                        ? "PASSWORD CHANGE PENDING"
                        : "ACCESS READY"}

                    </div>



                    {/* CONTACT */}

                    <div className="admin-client-contact">

                      <span>

                        <Mail
                          size={13}
                          strokeWidth={1.6}
                        />

                        {developer.email}

                      </span>


                      {developer.phone && (

                        <span>

                          <Phone
                            size={13}
                            strokeWidth={1.6}
                          />

                          {developer.phone}

                        </span>

                      )}

                    </div>



                    {/* STATUS */}

                    <div>

                      <span
                        className={
                          developer.active
                            ? "admin-client-status active"
                            : "admin-client-status inactive"
                        }
                      >

                        <i />

                        {developer.active
                          ? "ACTIVE"
                          : "INACTIVE"}

                      </span>

                    </div>



                    {/* ACTION */}

                    <div className="admin-client-menu">

                      <button
                        type="button"
                        aria-label="Developer actions"
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
                  No developers found.
                </h3>

                <p>

                  Add your first developer
                  to start assigning modules.

                </p>

              </div>

            )}

          </div>

        </section>

      </main>



      {/* ======================================
          ADD DEVELOPER MODAL
      ====================================== */}

      {showAddDeveloper && (

        <div
          className="admin-developer-modal-backdrop"
          onMouseDown={(e) => {

            if (
              e.target === e.currentTarget
            ) {

              closeModal();

            }

          }}
        >

          <div className="admin-developer-modal">


            {/* MODAL HEADER */}

            <div className="admin-developer-modal-head">

              <div>

                <span>
                  FALDREN / TEAM
                </span>

                <h2>
                  Add developer
                </h2>

              </div>


              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  creating
                }
                aria-label="Close"
              >

                <X
                  size={20}
                  strokeWidth={1.6}
                />

              </button>

            </div>



            {/* FORM */}

            <form
              onSubmit={
                handleCreateDeveloper
              }
              className="admin-developer-form"
            >


              <div className="admin-developer-field">

                <label>
                  Full name
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Developer name"
                  value={
                    form.fullName
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    creating
                  }
                  required
                />

              </div>



              <div className="admin-developer-field">

                <label>
                  Email address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="developer@faldren.com"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    creating
                  }
                  required
                />

              </div>



              <div className="admin-developer-field">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    creating
                  }
                />

              </div>



              <div className="admin-developer-field">

                <label>
                  Temporary password
                </label>


                <div className="admin-developer-password">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Minimum 8 characters"
                    value={
                      form.password
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      creating
                    }
                    minLength={8}
                    required
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        current =>
                          !current
                      )
                    }
                    tabIndex={-1}
                  >

                    {showPassword ? (

                      <EyeOff
                        size={17}
                      />

                    ) : (

                      <Eye
                        size={17}
                      />

                    )}

                  </button>

                </div>

              </div>



              {error && (

                <p className="admin-developer-form-error">
                  {error}
                </p>

              )}



              <div className="admin-developer-form-note">

                Developer will be required
                to change this password
                after first login.

              </div>



              <div className="admin-developer-form-actions">

                <button
                  type="button"
                  className="admin-developer-cancel"
                  onClick={
                    closeModal
                  }
                  disabled={
                    creating
                  }
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="admin-developer-create"
                  disabled={
                    creating
                  }
                >

                  {creating
                    ? "Creating..."
                    : "Create developer"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}

export default AdminDevelopers;