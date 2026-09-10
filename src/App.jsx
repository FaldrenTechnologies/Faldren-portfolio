import { useState } from "react";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ClientDashboard from "./pages/client/ClientDashboard";

import "./styles/auth.css";
import "./styles/client.css";

function App() {
  const [page, setPage] = useState("register");

  const handleRegister = () => {
    setPage("login");
  };

  const handleLogin = () => {
    setPage("dashboard");
  };

  const handleLogout = () => {
    setPage("login");
  };

  return (
    <>
      {page === "register" && (
        <Register
          onRegister={handleRegister}
          onLogin={() => setPage("login")}
        />
      )}

      {page === "login" && (
        <Login
          onLogin={handleLogin}
          onRegister={() => setPage("register")}
        />
      )}

      {page === "dashboard" && (
        <ClientDashboard onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;