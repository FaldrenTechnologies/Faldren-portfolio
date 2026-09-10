import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
      setSuccess(true);

      setTimeout(() => {
        navigate("/client/dashboard");
      }, 1500);
    }
  };

  return (
    <main className="auth-page">

      {success && (
        <div className="success-popup">
          <div className="success-icon">✓</div>

          <div>
            <strong>Login successful</strong>
            <p>Redirecting to your dashboard...</p>
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
            <p className="auth-eyebrow">WELCOME BACK</p>

            <h1>Client Login</h1>

            <p>
              Access your projects, updates and conversations.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={success}
            >
              {success ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="auth-switch">
            <span>New client?</span>

            <button
              type="button"
              onClick={() => navigate("/register")}
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