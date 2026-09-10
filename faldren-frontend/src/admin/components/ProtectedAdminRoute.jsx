import React from "react";

import {
  Navigate
} from "react-router-dom";


function ProtectedAdminRoute({
  children
}) {

  const token =
    localStorage.getItem(
      "adminToken"
    );

  const role =
    localStorage.getItem(
      "adminRole"
    );


  if (
    !token ||
    role !== "ADMIN"
  ) {

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );

  }


  return children;

}

export default ProtectedAdminRoute;