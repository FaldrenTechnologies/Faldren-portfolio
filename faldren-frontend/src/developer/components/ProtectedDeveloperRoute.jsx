import React, {
  useEffect,
  useState
} from "react";

import {
  Navigate,
  useLocation
} from "react-router-dom";


const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");


const clearDeveloperSession = () => {

  localStorage.removeItem(
    "developerToken"
  );

  localStorage.removeItem(
    "developerName"
  );

  localStorage.removeItem(
    "developerEmail"
  );

  localStorage.removeItem(
    "developerRole"
  );

  localStorage.removeItem(
    "developerMustChangePassword"
  );

};


function ProtectedDeveloperRoute({
  children
}) {

  const location =
    useLocation();


  const [status, setStatus] =
    useState("CHECKING");

  const [mustChangePassword,
    setMustChangePassword] =
    useState(false);


  useEffect(() => {

    const validateDeveloper =
      async () => {

        const token =
          localStorage.getItem(
            "developerToken"
          );


        if (!token) {

          setStatus("DENIED");

          return;
        }


        try {

          const response =
            await fetch(
              `${API_BASE}/api/developer/session`,
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
              "Invalid developer session"
            );
          }


          const data =
            await response.json();


          if (
            data.role !== "DEVELOPER"
          ) {

            throw new Error(
              "Developer access denied"
            );
          }


          localStorage.setItem(
            "developerName",
            data.fullName
          );

          localStorage.setItem(
            "developerEmail",
            data.email
          );

          localStorage.setItem(
            "developerRole",
            data.role
          );

          localStorage.setItem(
            "developerMustChangePassword",
            String(
              data.mustChangePassword
            )
          );


          setMustChangePassword(
            data.mustChangePassword
          );

          setStatus("ALLOWED");


        } catch (error) {

          console.error(
            "Developer session error:",
            error
          );


          clearDeveloperSession();

          setStatus("DENIED");

        }

      };


    validateDeveloper();

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
        to="/developer/login"
        replace
      />
    );

  }


  const isChangePasswordPage =
    location.pathname ===
    "/developer/change-password";


  if (
    mustChangePassword &&
    !isChangePasswordPage
  ) {

    return (
      <Navigate
        to="/developer/change-password"
        replace
      />
    );

  }


  if (
    !mustChangePassword &&
    isChangePasswordPage
  ) {

    return (
      <Navigate
        to="/developer/dashboard"
        replace
      />
    );

  }


  return children;
}


export default ProtectedDeveloperRoute;