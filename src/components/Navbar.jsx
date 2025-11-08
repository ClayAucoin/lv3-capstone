// src/components/Navbar.jsx

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./Navbar.css";

export default function Navbar() {
  const { user, isLoading, requestLogout } = useAuth();
  const location = useLocation();
  const basePath = location.pathname
    .replace(/^((?:\/[^/]+){1}).*$/, "$1")
    .replace(/\/$/, "");

  // console.log("Navbar: user: ", user);
  // console.log("Navbar: basePath: ", basePath);

  if (isLoading) return null;

  return (
    <>
      <nav
        className={`navbar d-flex justify-content-between p-2 ${
          user && "border-bottom"
        }`}
      >
        <div className="d-flex justify-content-between">
          {user && <Link to="/analytics">Analytics</Link>}
          {user && (
            <div className="d-flex justify-content-between  ">
              {user && basePath !== "/view-watchlist" && (
                <div className="px-1">
                  <span className="divider px-1">|</span>
                  <Link to="/view-watchlist">View Watchlist</Link>
                </div>
              )}
              {user && basePath !== "/pick-movie" && (
                <div>
                  <span className="divider px-1">|</span>
                  <Link to="/pick-movie">Pick Movie</Link>
                </div>
              )}
            </div>
          )}
          {user?.is_admin &&
            basePath !== "/manage-users" &&
            basePath !== "/edit-user" &&
            basePath !== "/add-user" && (
              <div>
                <span className="divider px-1">|</span>
                <Link to="/manage-users">Manage Users</Link>
              </div>
            )}
        </div>
        {user && (
          <div>
            <span className="me-3">
              Logged in as: <b>{user.first_name}</b>
            </span>
            <button
              className="btn btn-outline-secondary logout-button"
              onClick={requestLogout}
            >
              Log out
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
