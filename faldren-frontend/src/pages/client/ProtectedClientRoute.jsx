import React, {
  useEffect,
  useState
} from "react";

import {
  Navigate
} from "react-router-dom";


const API_BASE =
  "http://localhost:8080";


function ProtectedClientRoute({
  children
}) {

  const [status, setStatus] =
    useState("CHECKING");


  useEffect(() => {

    const validateClient =
      async () => {

        const token =
          localStorage.getItem(
            "clientToken"
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
              `${API_BASE}/api/client/session`,
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
              "Client session invalid"
            );

          }


          setStatus(
            "ALLOWED"
          );


        } catch (error) {

          console.error(
            "Client session validation failed:",
            error
          );


          localStorage.removeItem(
            "clientToken"
          );

          localStorage.removeItem(
            "clientRole"
          );

          localStorage.removeItem(
            "clientName"
          );

          localStorage.removeItem(
            "clientEmail"
          );

          localStorage.removeItem(
            "clientCompany"
          );


          setStatus(
            "DENIED"
          );

        }

      };


    validateClient();

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
        to="/login"
        replace
      />
    );

  }


  return children;

}


export default ProtectedClientRoute;