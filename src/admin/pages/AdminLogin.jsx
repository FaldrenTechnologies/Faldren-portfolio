import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import "../admin.css";

function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  // Already logged in na dashboard-ku redirect
  useEffect(() => {

    const isAdminLoggedIn =
      localStorage.getItem("adminLoggedIn") === "true";

    if (isAdminLoggedIn) {
      navigate("/admin/dashboard", {
        replace: true
      });
    }

  }, [navigate]);


  // TEMPORARY LOGIN
  // Later Spring Boot API connect pannumbodhu
  // indha function-a replace pannuvom.
  const handleSubmit = (e) => {

    e.preventDefault();

    localStorage.setItem(
      "adminLoggedIn",
      "true"
    );

    navigate("/admin/dashboard");

  };


  return (
    <main className="admin-login-page">

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
            <em>in view.</em>
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
              Sign in to continue to the FALDREN admin workspace.
            </p>


            <form onSubmit={handleSubmit}>


              {/* EMAIL */}

              <div className="admin-form-field">

                <label htmlFor="admin-email">
                  Email address
                </label>


                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@faldren.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                  required
                />

              </div>



              {/* PASSWORD */}

              <div className="admin-form-field">

                <label htmlFor="admin-password">
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
                      setPassword(e.target.value)
                    }
                    autoComplete="current-password"
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
                        (current) => !current
                      )
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



              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="admin-login-submit"
              >

                <span>
                  Enter workspace
                </span>

                <ArrowRight
                  size={18}
                  strokeWidth={1.7}
                />

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