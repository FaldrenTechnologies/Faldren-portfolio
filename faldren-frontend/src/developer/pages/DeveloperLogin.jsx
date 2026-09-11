import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  X
} from "lucide-react";

import "../../admin/admin.css";


const API_BASE =
  "http://localhost:8080";


// ==========================================
// CLEAR ADMIN SESSION
// ==========================================

const clearAdminSession = () => {

  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminRole");
  localStorage.removeItem("adminName");
  localStorage.removeItem("adminEmail");
  localStorage.removeItem("adminLoggedIn");

};


// ==========================================
// CLEAR CLIENT SESSION
// ==========================================

const clearClientSession = () => {

  localStorage.removeItem("clientToken");
  localStorage.removeItem("clientRole");
  localStorage.removeItem("clientName");
  localStorage.removeItem("clientEmail");
  localStorage.removeItem("clientCompany");

};


function DeveloperLogin() {

  const navigate =
    useNavigate();


  // ==========================================
  // INPUT REFS
  // ==========================================

  const emailRef =
    useRef(null);

  const passwordRef =
    useRef(null);


  // ==========================================
  // STATES
  // ==========================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // ALREADY LOGGED IN
  // ==========================================

  useEffect(() => {

    const token =
      localStorage.getItem(
        "developerToken"
      );

    const role =
      localStorage.getItem(
        "developerRole"
      );

    const mustChangePassword =
      localStorage.getItem(
        "developerMustChangePassword"
      );


    if (
      token &&
      role === "DEVELOPER"
    ) {

      clearAdminSession();
      clearClientSession();


      if (
        mustChangePassword === "true"
      ) {

        navigate(
          "/developer/change-password",
          {
            replace: true
          }
        );

      } else {

        navigate(
          "/developer/dashboard",
          {
            replace: true
          }
        );

      }

    }

  }, [navigate]);



  // ==========================================
  // AUTO CLOSE ERROR
  // ==========================================

  useEffect(() => {

    if (!error) {
      return;
    }


    const timer =
      setTimeout(() => {

        setError("");

      }, 4500);


    return () =>
      clearTimeout(timer);

  }, [error]);



  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");


      const email =
        emailRef.current
          ?.value
          .trim() || "";

      const password =
        passwordRef.current
          ?.value || "";


      if (
        !email ||
        !password
      ) {

        setError(
          "Email and password are required."
        );

        return;
      }


      setLoading(true);


      try {

        const response =
          await fetch(
            `${API_BASE}/api/developer/auth/login`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                email,
                password
              })
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.message ||
            "Invalid email or password."
          );

          return;
        }


        if (
          data.role !== "DEVELOPER"
        ) {

          setError(
            "Developer access denied."
          );

          return;
        }


        // ======================================
        // ONE PORTAL SESSION ONLY
        // ======================================

        clearAdminSession();

        clearClientSession();


        // ======================================
        // SAVE DEVELOPER SESSION
        // ======================================

        localStorage.setItem(
          "developerToken",
          data.token
        );

        localStorage.setItem(
          "developerName",
          data.fullName
        );

        localStorage.setItem(
          "developerEmail",
          data.email
        );

        localStorage.setItem(
          "developerRole",
          data.role
        );

        localStorage.setItem(
          "developerMustChangePassword",
          String(
            data.mustChangePassword
          )
        );


        // ======================================
        // FIRST LOGIN PASSWORD CHANGE
        // ======================================

        if (
          data.mustChangePassword
        ) {

          navigate(
            "/developer/change-password",
            {
              replace: true
            }
          );

          return;
        }


        // ======================================
        // DASHBOARD
        // ======================================

        navigate(
          "/developer/dashboard",
          {
            replace: true
          }
        );


      } catch (error) {

        console.error(
          "Developer login error:",
          error
        );


        setError(
          "Unable to connect to the server."
        );


      } finally {

        setLoading(false);

      }

    };



  return (

    <main className="admin-login-page">


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="admin-login-error-popup">

          <div className="admin-login-error-icon">

            <AlertCircle
              size={18}
              strokeWidth={1.8}
            />

          </div>


          <div className="admin-login-error-content">

            <strong>
              Access denied
            </strong>

            <span>
              {error}
            </span>

          </div>


          <button
            type="button"
            className="admin-login-error-close"
            onClick={() =>
              setError("")
            }
            aria-label="Close message"
          >

            <X
              size={16}
              strokeWidth={1.7}
            />

          </button>

        </div>

      )}



      {/* ======================================
          BRAND
      ====================================== */}

      <div className="admin-login-brand">
        FALDREN
      </div>



      <div className="admin-login-grid">


        {/* ======================================
            LEFT
        ====================================== */}

        <section className="admin-login-intro">

          <span className="admin-login-kicker">
            FALDREN / DEVELOPER
          </span>


          <h1>

            Build with
            <br />

            focus.
            <br />

            <em>
              Ship with clarity.
            </em>

          </h1>


          <p>

            Access your assigned modules,
            branches and work waiting
            for review.

          </p>


          <div className="admin-login-index">

            <span>
              DEV
            </span>

            <span>
              DEVELOPMENT SYSTEM
            </span>

          </div>

        </section>



        {/* ======================================
            RIGHT
        ====================================== */}

        <section className="admin-login-panel">


          <div className="admin-login-panel-head">

            <span>
              DEVELOPER ACCESS
            </span>


            <span className="admin-status">

              <i />

              ONLINE

            </span>

          </div>



          <div className="admin-login-form-wrap">

            <h2>
              Welcome back.
            </h2>


            <p className="admin-login-subtitle">

              Sign in to continue to the
              FALDREN developer workspace.

            </p>


            <form
              onSubmit={handleSubmit}
            >


              {/* ==================================
                  EMAIL
              ================================== */}

              <div className="admin-form-field">

                <label
                  htmlFor="developer-email"
                >
                  Email address
                </label>


                <input
                  ref={emailRef}
                  id="developer-email"
                  name="email"
                  type="email"
                  placeholder="Enter developer email"
                  autoComplete="username"
                  disabled={loading}
                  required
                />

              </div>



              {/* ==================================
                  PASSWORD
              ================================== */}

              <div className="admin-form-field">

                <label
                  htmlFor="developer-password"
                >
                  Password
                </label>


                <div className="admin-password-field">

                  <input
                    ref={passwordRef}
                    id="developer-password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />


                  <button
                    type="button"
                    className="admin-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        current =>
                          !current
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (

                      <EyeOff
                        size={18}
                        strokeWidth={1.6}
                      />

                    ) : (

                      <Eye
                        size={18}
                        strokeWidth={1.6}
                      />

                    )}

                  </button>

                </div>

              </div>



              {/* ==================================
                  LOGIN
              ================================== */}

              <button
                type="submit"
                className="admin-login-submit"
                disabled={loading}
              >

                <span>

                  {loading
                    ? "Verifying..."
                    : "Enter workspace"}

                </span>


                {!loading && (

                  <ArrowRight
                    size={18}
                    strokeWidth={1.7}
                  />

                )}

              </button>

            </form>


            <p className="admin-login-help">
              FALDREN internal developer access only.
            </p>

          </div>



          <div className="admin-login-panel-footer">

            <span>
              FALDREN
            </span>

            <span>
              DEV / SYSTEM
            </span>

          </div>

        </section>

      </div>

    </main>

  );

}


export default DeveloperLogin;