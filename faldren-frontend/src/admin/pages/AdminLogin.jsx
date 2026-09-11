import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  X
} from "lucide-react";

import "../admin.css";


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


function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

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
        "adminToken"
      );

    const role =
      localStorage.getItem(
        "adminRole"
      );


    if (
      token &&
      role === "ADMIN"
    ) {

      // Only one portal session
      // can exist at a time.
      clearClientSession();


      navigate(
        "/admin/dashboard",
        {
          replace: true
        }
      );

    }

  }, [navigate]);



  // ==========================================
  // AUTO CLOSE ERROR POPUP
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

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);


    try {

      const response =
        await fetch(
          "http://localhost:8080/api/admin/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              email:
                email.trim(),

              password

            })
          }
        );


      const data =
        await response.json();


      // ======================================
      // WRONG EMAIL / PASSWORD
      // ======================================

      if (!response.ok) {

        setError(
          data.message ||
          "Invalid email or password."
        );

        return;

      }


      // ======================================
      // ADMIN ROLE CHECK
      // ======================================

      if (
        data.role !== "ADMIN"
      ) {

        setError(
          "Admin access denied."
        );

        return;

      }


      // ======================================
      // REMOVE OLD CLIENT SESSION
      // ======================================

      clearClientSession();


      // ======================================
      // SAVE ADMIN LOGIN
      // ======================================

      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "adminName",
        data.fullName
      );

      localStorage.setItem(
        "adminEmail",
        data.email
      );

      localStorage.setItem(
        "adminRole",
        data.role
      );


      // Remove old temporary value

      localStorage.removeItem(
        "adminLoggedIn"
      );


      // ======================================
      // DASHBOARD
      // ======================================

      navigate(
        "/admin/dashboard",
        {
          replace: true
        }
      );


    } catch (error) {

      console.error(
        "Admin login error:",
        error
      );


      setError(
        "Unable to connect to the server. Please check if the backend is running."
      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <main className="admin-login-page">


      {/* ======================================
          ERROR POPUP
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



      {/* BRAND */}

      <div className="admin-login-brand">
        FALDREN
      </div>



      <div className="admin-login-grid">


        {/* ========================================
            LEFT SIDE
        ======================================== */}

        <section className="admin-login-intro">

          <span className="admin-login-kicker">
            FALDREN / ADMIN
          </span>


          <h1>

            Built to keep
            <br />

            everything
            <br />

            <em>
              in view.
            </em>

          </h1>


          <p>

            Manage clients, projects and the work moving
            through FALDREN from one place.

          </p>


          <div className="admin-login-index">

            <span>
              01
            </span>

            <span>
              ADMINISTRATION SYSTEM
            </span>

          </div>

        </section>



        {/* ========================================
            RIGHT SIDE
        ======================================== */}

        <section className="admin-login-panel">


          {/* PANEL HEADER */}

          <div className="admin-login-panel-head">

            <span>
              SECURE ACCESS
            </span>


            <span className="admin-status">

              <i />

              ONLINE

            </span>

          </div>



          {/* LOGIN FORM */}

          <div className="admin-login-form-wrap">

            <h2>
              Welcome back.
            </h2>


            <p className="admin-login-subtitle">

              Sign in to continue to the
              FALDREN admin workspace.

            </p>


            <form
              onSubmit={handleSubmit}
            >


              {/* EMAIL */}

              <div className="admin-form-field">

                <label
                  htmlFor="admin-email"
                >
                  Email address
                </label>


                <input
                  id="admin-email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  autoComplete="email"
                  disabled={loading}
                  required
                />

              </div>



              {/* PASSWORD */}

              <div className="admin-form-field">

                <label
                  htmlFor="admin-password"
                >
                  Password
                </label>


                <div className="admin-password-field">

                  <input
                    id="admin-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />


                  <button
                    type="button"
                    className="admin-password-toggle"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword(
                        current =>
                          !current
                      )
                    }
                    disabled={loading}
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



              {/* LOGIN BUTTON */}

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
              FALDREN internal access only.
            </p>

          </div>



          {/* PANEL FOOTER */}

          <div className="admin-login-panel-footer">

            <span>
              FALDREN
            </span>

            <span>
              ADMIN / 001
            </span>

          </div>

        </section>

      </div>

    </main>

  );

}

export default AdminLogin;