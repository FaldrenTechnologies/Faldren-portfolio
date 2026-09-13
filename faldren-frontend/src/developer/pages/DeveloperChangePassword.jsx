import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle
} from "lucide-react";

import "../../admin/admin.css";


const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");


// ==========================================
// PASSWORD FIELD
// IMPORTANT:
// Component main component-ku veliya irukkanum.
// ==========================================

function PasswordField({
  id,
  label,
  value,
  setValue,
  visible,
  setVisible,
  loading,
  autoComplete
}) {

  return (

    <div className="admin-form-field">

      <label htmlFor={id}>
        {label}
      </label>


      <div className="admin-password-field">

        <input
          id={id}
          name={id}
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            setValue(
              event.target.value
            )
          }
          autoComplete={autoComplete}
          disabled={loading}
          required
        />


        <button
          type="button"
          className="admin-password-toggle"
          onClick={() =>
            setVisible(
              current =>
                !current
            )
          }
          disabled={loading}
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
        >

          {visible ? (

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

  );

}


// ==========================================
// MAIN COMPONENT
// ==========================================

function DeveloperChangePassword() {

  const navigate =
    useNavigate();


  // ==========================================
  // PASSWORD VALUES
  // ==========================================

  const [
    currentPassword,
    setCurrentPassword
  ] = useState("");

  const [
    newPassword,
    setNewPassword
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");


  // ==========================================
  // SHOW / HIDE
  // ==========================================

  const [
    showCurrent,
    setShowCurrent
  ] = useState(false);

  const [
    showNew,
    setShowNew
  ] = useState(false);

  const [
    showConfirm,
    setShowConfirm
  ] = useState(false);


  // ==========================================
  // UI STATES
  // ==========================================

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");


      // ======================================
      // PASSWORD MATCH
      // ======================================

      if (
        newPassword !==
        confirmPassword
      ) {

        setError(
          "New passwords do not match."
        );

        return;
      }


      // ======================================
      // MINIMUM LENGTH
      // ======================================

      if (
        newPassword.length < 8
      ) {

        setError(
          "Password must contain at least 8 characters."
        );

        return;
      }


      // ======================================
      // OLD / NEW SHOULD NOT MATCH
      // ======================================

      if (
        currentPassword ===
        newPassword
      ) {

        setError(
          "New password must be different from current password."
        );

        return;
      }


      const token =
        localStorage.getItem(
          "developerToken"
        );


      // ======================================
      // TOKEN CHECK
      // ======================================

      if (!token) {

        navigate(
          "/developer/login",
          {
            replace: true
          }
        );

        return;
      }


      setLoading(true);


      try {

        const response =
          await fetch(
            `${API_BASE}/api/developer/auth/change-password`,
            {
              method: "PUT",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`

              },

              body: JSON.stringify({

                currentPassword,

                newPassword,

                confirmPassword

              })

            }
          );


        const data =
          await response.json();


        // ======================================
        // ERROR
        // ======================================

        if (!response.ok) {

          setError(
            data.message ||
            "Unable to change password."
          );

          return;
        }


        // ======================================
        // PASSWORD CHANGED
        // ======================================

        localStorage.setItem(
          "developerMustChangePassword",
          "false"
        );


        navigate(
          "/developer/dashboard",
          {
            replace: true
          }
        );


      } catch (error) {

        console.error(
          "Change password error:",
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


      {/* BRAND */}

      <div className="admin-login-brand">
        FALDREN
      </div>



      <div className="admin-login-grid">


        {/* ======================================
            LEFT
        ====================================== */}

        <section className="admin-login-intro">

          <span className="admin-login-kicker">
            FALDREN / SECURITY
          </span>


          <h1>

            Secure your
            <br />

            workspace
            <br />

            <em>
              before you build.
            </em>

          </h1>


          <p>

            Replace the temporary password
            provided by your administrator
            before accessing developer tools.

          </p>


          <div className="admin-login-index">

            <span>
              01
            </span>

            <span>
              FIRST LOGIN SECURITY
            </span>

          </div>

        </section>



        {/* ======================================
            RIGHT
        ====================================== */}

        <section className="admin-login-panel">


          <div className="admin-login-panel-head">

            <span>
              PASSWORD SETUP
            </span>


            <span className="admin-status">

              <i />

              REQUIRED

            </span>

          </div>



          <div className="admin-login-form-wrap">


            <h2>
              Set your password.
            </h2>


            <p className="admin-login-subtitle">

              Your new password must contain
              at least 8 characters.

            </p>



            <form
              onSubmit={handleSubmit}
            >


              <PasswordField
                id="current-password"
                label="Current temporary password"
                value={currentPassword}
                setValue={setCurrentPassword}
                visible={showCurrent}
                setVisible={setShowCurrent}
                loading={loading}
                autoComplete="current-password"
              />


              <PasswordField
                id="new-password"
                label="New password"
                value={newPassword}
                setValue={setNewPassword}
                visible={showNew}
                setVisible={setShowNew}
                loading={loading}
                autoComplete="new-password"
              />


              <PasswordField
                id="confirm-password"
                label="Confirm new password"
                value={confirmPassword}
                setValue={setConfirmPassword}
                visible={showConfirm}
                setVisible={setShowConfirm}
                loading={loading}
                autoComplete="new-password"
              />


              {/* ==================================
                  ERROR
              ================================== */}

              {error && (

                <div className="admin-developer-form-error">

                  <AlertCircle
                    size={15}
                  />

                  <span>
                    {error}
                  </span>

                </div>

              )}



              {/* ==================================
                  SUBMIT
              ================================== */}

              <button
                type="submit"
                className="admin-login-submit"
                disabled={loading}
              >

                <span>

                  {loading
                    ? "Updating..."
                    : "Set password"}

                </span>


                {!loading && (

                  <ArrowRight
                    size={18}
                    strokeWidth={1.7}
                  />

                )}

              </button>

            </form>

          </div>



          <div className="admin-login-panel-footer">

            <span>
              FALDREN
            </span>

            <span>
              SECURITY / DEV
            </span>

          </div>

        </section>

      </div>

    </main>

  );

}


export default DeveloperChangePassword;