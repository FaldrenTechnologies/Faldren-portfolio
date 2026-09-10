import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!name || !company || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    const client = {
      name,
      company,
      email,
      password,
    };

    localStorage.setItem(
      "faldrenClient",
      JSON.stringify(client)
    );

    setSuccess(true);

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <main className="auth-page">

      {success && (
        <div className="success-popup">
          <div className="success-icon">✓</div>

          <div>
            <strong>Registration successful</strong>
            <p>Redirecting to login page...</p>
          </div>
        </div>
      )}

      <div className="auth-container">

        <div className="auth-brand">
          <span>FALDREN</span>
          <p>CLIENT PORTAL</p>
        </div>

        <div className="auth-card">

          <div className="auth-heading">
            <p className="auth-eyebrow">GET STARTED</p>

            <h1>Create Account</h1>

            <p>
              Create your client account to manage your projects.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={success}
              />
            </div>

            <div className="form-group">
              <label>Company</label>

              <input
                type="text"
                placeholder="Enter company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={success}
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={success}
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={success}
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
              disabled={success}
            >
              {success ? "Account Created" : "Create Account"}
            </button>

          </form>

          <div className="auth-switch">
            <span>Already have an account?</span>

            <button
              type="button"
              onClick={() => navigate("/login")}
              disabled={success}
            >
              Login
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}

export default Register;