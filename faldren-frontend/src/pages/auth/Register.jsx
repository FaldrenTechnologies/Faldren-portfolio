import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);


  // ==========================================
  // SEND OTP
  // ==========================================

  const handleSendOtp = async (e) => {

    e.preventDefault();

    setError("");


    if (
      !name ||
      !company ||
      !phone ||
      !email ||
      !password
    ) {

      setError(
        "Please fill in all fields."
      );

      return;
    }


    if (phone.length !== 10) {

      setError(
        "Please enter a valid 10-digit phone number."
      );

      return;
    }


    if (password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }


    setLoading(true);


    try {

      const response =
        await fetch(
          "http://localhost:8080/api/client/auth/send-otp",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              fullName:
                name.trim(),

              companyName:
                company.trim(),

              phone:
                phone.trim(),

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
          "Unable to send OTP."
        );

        return;
      }


      setGeneratedOtp(
        data.devOtp || ""
      );

      setOtp("");

      setOtpSent(true);


    } catch (error) {

      console.error(
        "Send OTP error:",
        error
      );

      setError(
        "Unable to connect to the server. Please check if the backend is running."
      );


    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // VERIFY OTP + REGISTER
  // ==========================================

  const handleVerifyOtp = async (e) => {

    e.preventDefault();

    setError("");


    if (otp.length !== 6) {

      setError(
        "Please enter the 6-digit OTP."
      );

      return;
    }


    setLoading(true);


    try {

      const response =
        await fetch(
          "http://localhost:8080/api/client/auth/verify-register",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              email:
                email.trim(),

              otp
            })
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        setError(
          data.message ||
          "OTP verification failed."
        );

        return;
      }


      setSuccess(true);


      setTimeout(() => {

        navigate(
          "/login",
          {
            replace: true
          }
        );

      }, 1500);


    } catch (error) {

      console.error(
        "Verify OTP error:",
        error
      );


      setError(
        "Unable to connect to the server. Please check if the backend is running."
      );


    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // RESEND OTP
  // ==========================================

  const handleResendOtp = async () => {

    setError("");
    setOtp("");

    setLoading(true);


    try {

      const response =
        await fetch(
          "http://localhost:8080/api/client/auth/send-otp",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              fullName:
                name.trim(),

              companyName:
                company.trim(),

              phone:
                phone.trim(),

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
          "Unable to resend OTP."
        );

        return;
      }


      setGeneratedOtp(
        data.devOtp || ""
      );


    } catch (error) {

      console.error(
        "Resend OTP error:",
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

    <main className="auth-page">


      {success && (

        <div className="success-popup">

          <div className="success-icon">
            ✓
          </div>

          <div>

            <strong>
              Registration successful
            </strong>

            <p>
              Redirecting to login page...
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


          {!otpSent ? (

            <>

              <div className="auth-heading">

                <p className="auth-eyebrow">
                  GET STARTED
                </p>

                <h1>
                  Create Account
                </h1>

                <p>
                  Create your client account
                  to manage your projects.
                </p>

              </div>



              <form
                onSubmit={
                  handleSendOtp
                }
              >


                <div className="form-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    disabled={loading}
                    required
                  />

                </div>



                <div className="form-group">

                  <label>
                    Company
                  </label>

                  <input
                    type="text"
                    placeholder="Enter company name"
                    value={company}
                    onChange={(e) =>
                      setCompany(
                        e.target.value
                      )
                    }
                    disabled={loading}
                    required
                  />

                </div>



                <div className="form-group">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength="10"
                    placeholder="Enter 10-digit phone number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(
                            0,
                            10
                          )
                      )
                    }
                    disabled={loading}
                    required
                  />

                </div>



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
                    placeholder="Create a password"
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
                  disabled={loading}
                >

                  {loading
                    ? "Sending..."
                    : "Send OTP"}

                </button>

              </form>



              <div className="auth-switch">

                <span>
                  Already have an account?
                </span>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/login")
                  }
                >
                  Login
                </button>

              </div>

            </>

          ) : (

            <>


              <div className="auth-heading">

                <p className="auth-eyebrow">
                  EMAIL VERIFICATION
                </p>

                <h1>
                  Verify OTP
                </h1>

                <p>

                  Enter the verification code for

                  <br />

                  <strong>
                    {email}
                  </strong>

                </p>

              </div>



              {/* DEVELOPMENT ONLY */}

              {generatedOtp && (

                <div className="demo-otp">

                  <span>
                    DEMO OTP
                  </span>

                  <strong>
                    {generatedOtp}
                  </strong>

                </div>

              )}



              <form
                onSubmit={
                  handleVerifyOtp
                }
              >


                <div className="form-group">

                  <label>
                    OTP Code
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(
                            0,
                            6
                          )
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
                  disabled={loading}
                >

                  {loading
                    ? "Verifying..."
                    : "Verify OTP"}

                </button>

              </form>



              <div className="auth-switch">

                <span>
                  Didn't receive the code?
                </span>

                <button
                  type="button"
                  onClick={
                    handleResendOtp
                  }
                  disabled={loading}
                >
                  Resend OTP
                </button>

              </div>



              <div className="auth-switch">

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {

                    setOtpSent(false);

                    setOtp("");

                    setGeneratedOtp("");

                    setError("");

                  }}
                >
                  Change details
                </button>

              </div>

            </>

          )}

        </div>

      </div>

    </main>

  );

}

export default Register;