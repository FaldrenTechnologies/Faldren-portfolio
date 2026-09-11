import React, {
  useEffect,
  useState
} from "react";

import {
  Navigate
} from "react-router-dom";


const API_BASE =
  "http://localhost:8080";


function ProtectedAdminRoute({
  children
}) {

  const [status, setStatus] =
    useState("CHECKING");


  useEffect(() => {

    const validateAdmin =
      async () => {

        const token =
          localStorage.getItem(
            "adminToken"
          );


        if (!token) {

          setStatus(
            "DENIED"
          );

          return;
        }


        try {

          const response =
            await fetch(
              `${API_BASE}/api/admin/session`,
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );


          if (!response.ok) {

            throw new Error(
              "Admin session invalid"
            );
          }


          setStatus(
            "ALLOWED"
          );


        } catch (error) {

          console.error(
            "Admin session validation failed:",
            error
          );


          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem(
            "adminRole"
          );

          localStorage.removeItem(
            "adminName"
          );

          localStorage.removeItem(
            "adminEmail"
          );

          localStorage.removeItem(
            "adminLoggedIn"
          );


          setStatus(
            "DENIED"
          );

        }

      };


    validateAdmin();

  }, []);


  if (
    status === "CHECKING"
  ) {

    return null;

  }


  if (
    status === "DENIED"
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