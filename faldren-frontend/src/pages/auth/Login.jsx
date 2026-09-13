import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const clearAdminSession = () => {

  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminRole");
  localStorage.removeItem("adminName");
  localStorage.removeItem("adminEmail");
  localStorage.removeItem("adminLoggedIn");

};


  // ==========================================
  // ALREADY LOGGED IN
  // ==========================================
useEffect(() => {

  const token =
    localStorage.getItem(
      "clientToken"
    );

  const role =
    localStorage.getItem(
      "clientRole"
    );


  if (
    token &&
    role === "CLIENT"
  ) {

    clearAdminSession();

    navigate(
      "/client/dashboard",
      {
        replace: true
      }
    );

  }

}, [navigate]);

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
          `${API_BASE}/api/client/auth/login`,
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


      if (!response.ok) {

        setError(
          data.message ||
          "Invalid email or password."
        );

        return;
      }


      if (data.role !== "CLIENT") {

        setError(
          "Client access denied."
        );

        return;
      }

      // ======================================
// REMOVE OLD ADMIN SESSION
// ======================================

clearAdminSession();


      // ======================================
      // SAVE CLIENT LOGIN
      // ======================================

      localStorage.setItem(
        "clientToken",
        data.token
      );

      localStorage.setItem(
        "clientName",
        data.fullName
      );

      localStorage.setItem(
        "clientEmail",
        data.email
      );

      localStorage.setItem(
        "clientCompany",
        data.companyName || ""
      );

      localStorage.setItem(
        "clientRole",
        data.role
      );


      setSuccess(true);


      setTimeout(() => {

        navigate(
          "/client/dashboard",
          {
            replace: true
          }
        );

      }, 1000);


    } catch (error) {

      console.error(
        "Client login error:",
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

    <main className="auth-page">


      {success && (

        <div className="success-popup">

          <div className="success-icon">
            ✓
          </div>


          <div>

            <strong>
              Login successful
            </strong>

            <p>
              Redirecting to your dashboard...
            </p>

          </div>

        </div>

      )}



      <div className="auth-container">


        <div className="auth-brand">

          <span>
            FALDREN
          </span>

          <p>
            CLIENT PORTAL
          </p>

        </div>



        <div className="auth-card">


          <div className="auth-heading">

            <p className="auth-eyebrow">
              WELCOME BACK
            </p>

            <h1>
              Client Login
            </h1>

            <p>
              Access your projects,
              updates and conversations.
            </p>

          </div>



          <form
            onSubmit={handleSubmit}
          >


            <div className="form-group">

              <label>
                Email
              </label>


              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                disabled={loading}
                required
              />

            </div>



            <div className="form-group">

              <label>
                Password
              </label>


              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                disabled={loading}
                required
              />

            </div>



            {error && (

              <p className="auth-error">
                {error}
              </p>

            )}



            <button
              type="submit"
              className="auth-button"
              disabled={
                loading ||
                success
              }
            >

              {loading
                ? "Verifying..."
                : success
                ? "Login successful"
                : "Login"}

            </button>

          </form>



          <div className="auth-switch">

            <span>
              New client?
            </span>


            <button
              type="button"
              onClick={() =>
                navigate(
                  "/register"
                )
              }
            >
              Create account
            </button>

          </div>


        </div>

      </div>

    </main>

  );

}

export default Login;