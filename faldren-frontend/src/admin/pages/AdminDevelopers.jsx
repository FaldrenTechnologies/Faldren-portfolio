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
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");


function AdminDevelopers() {

  const [developers, setDevelopers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [openMenuId, setOpenMenuId] =
    useState(null);

  const [developerToDelete, setDeveloperToDelete] =
    useState(null);

  const [deletingDeveloperId, setDeletingDeveloperId] =
    useState(null);

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



  // ==========================================
  // DELETE DEVELOPER
  // ==========================================

  const handleDeleteDeveloper =
    async () => {

      if (!developerToDelete) {
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

        setDeletingDeveloperId(
          developerToDelete.id
        );

        setError("");


        const response =
          await fetch(
            `${API_BASE}/api/admin/developers/${developerToDelete.id}`,
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
            "Unable to delete developer."
          );

          return;
        }


        setDevelopers(
          current =>
            current.filter(
              developer =>
                developer.id !==
                developerToDelete.id
            )
        );


        setDeveloperToDelete(
          null
        );

        setOpenMenuId(
          null
        );


      } catch (error) {

        console.error(
          "Delete developer error:",
          error
        );


        setError(
          "Unable to connect to the server."
        );


      } finally {

        setDeletingDeveloperId(
          null
        );
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

                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "flex-end"
                      }}
                    >

                      <button
                        type="button"
                        aria-label="Developer actions"
                        title="Developer actions"

                        style={{
                          width: "38px",
                          height: "38px",
                          display: "grid",
                          placeItems: "center",
                          border: 0,
                          background: "transparent",
                          color: "#777168",
                          cursor: "pointer"
                        }}

                        onClick={() =>
                          setOpenMenuId(
                            current =>
                              current === developer.id
                                ? null
                                : developer.id
                          )
                        }
                      >

                        <MoreHorizontal
                          size={19}
                          strokeWidth={1.6}
                        />

                      </button>


                      {openMenuId === developer.id && (

                        <div
                          style={{
                            position: "absolute",
                            top: "36px",
                            right: 0,
                            zIndex: 50,
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
                              height: "auto",
                              display: "block",
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

                              setDeveloperToDelete(
                                developer
                              );

                              setOpenMenuId(
                                null
                              );

                            }}
                          >

                            Delete developer

                          </button>

                        </div>

                      )}

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


      {/* ======================================
          DELETE DEVELOPER CONFIRMATION
      ====================================== */}

      {developerToDelete && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background:
              "rgba(16, 16, 14, 0.46)",
            backdropFilter:
              "blur(3px)"
          }}

          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget &&
              deletingDeveloperId === null
            ) {

              setDeveloperToDelete(
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
                "1px solid rgba(25, 25, 22, 0.22)",
              color: "#1c1c19"
            }}
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
              DELETE DEVELOPER
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
                {developerToDelete.fullName}
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
              Assigned modules and tasks for this
              developer will also be removed.
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
                  deletingDeveloperId !== null
                }

                onClick={() =>
                  setDeveloperToDelete(
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
                    deletingDeveloperId !== null
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    deletingDeveloperId !== null
                      ? 0.5
                      : 1
                }}
              >

                Cancel

              </button>


              <button
                type="button"

                disabled={
                  deletingDeveloperId !== null
                }

                onClick={
                  handleDeleteDeveloper
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
                    deletingDeveloperId !== null
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    deletingDeveloperId !== null
                      ? 0.5
                      : 1
                }}
              >

                {deletingDeveloperId !== null
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

export default AdminDevelopers;