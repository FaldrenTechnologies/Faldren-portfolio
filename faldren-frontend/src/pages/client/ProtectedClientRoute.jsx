import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedClientRoute({ children }) {

  const token =
    localStorage.getItem("clientToken");

  const role =
    localStorage.getItem("clientRole");

  if (!token || role !== "CLIENT") {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedClientRoute;