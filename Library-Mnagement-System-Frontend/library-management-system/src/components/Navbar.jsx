import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  });

  const [adminExists, setAdminExists] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const token = auth.token;
  const role = auth.role;
  const isLoggedIn = !!token;

  // 🔐 Handle logout
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuth({ token: null, role: null });
    navigate("/login");
  }

  // 🧠 Hide login/register on specific pages
  const hideUserLogin = location.pathname === "/login";
  const hideUserRegister = location.pathname === "/register";
  const hideAdminLogin = location.pathname === "/admin-login";

  // ✅ Show dashboard only if logged in and not already on dashboard
  const showAdminDashboardLink =
    isLoggedIn && role === "admin" && location.pathname !== "/admin-dashboard";

  const showUserDashboardLink =
    isLoggedIn && role === "user" && location.pathname !== "/user-dashboard";

  // 🔁 Sync localStorage changes (cross-tab & interval)
  useEffect(function syncAuthFromLocalStorage() {
    function checkAuth() {
      setAuth({
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
      });
    }

    const interval = setInterval(checkAuth, 1000); // Every second
    window.addEventListener("storage", checkAuth); // On tab switch

    return function cleanup() {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // 🛡️ Check if admin exists (for conditional Register button)
  useEffect(function checkAdminExists() {
    fetch("http://localhost:8080/api/users/admin-exists")
      .then(function (res) {
        return res.json();
      })
      .then(function (exists) {
        setAdminExists(exists);
      })
      .catch(function (err) {
        console.error("Failed to check admin existence:", err);
        setAdminExists(true); // fallback
      });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link
          className="navbar-brand"
          to={role === "admin" ? "/admin-dashboard" : "/"}
        >
          📚 BookMate
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/books">
                Books
              </Link>
            </li>

            {/* 🧍 User-only options */}
            {isLoggedIn && role === "user" ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-books">
                    My Books
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
                </li>
              </>
            ) : null}

            {/* 🛠 Admin/User Dashboard Links */}
            {showAdminDashboardLink && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin-dashboard">
                  Dashboard
                </Link>
              </li>
            )}
            {showUserDashboardLink && (
              <li className="nav-item">
                <Link className="nav-link" to="/user-dashboard">
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {/* 🧑 Admin Auth Links */}
            {!isLoggedIn && !hideAdminLogin && (
              <li className="nav-item me-2">
                <Link
                  className="btn btn-outline-warning btn-sm"
                  to="/admin-login"
                >
                  Admin Login
                </Link>
              </li>
            )}

            {!isLoggedIn && !adminExists && (
              <li className="nav-item me-3">
                <Link className="btn btn-warning btn-sm" to="/admin-register">
                  Admin Register
                </Link>
              </li>
            )}

            {isLoggedIn && role === "admin" && (
              <li className="nav-item me-3">
                <Link className="btn btn-light btn-sm" to="/admin-register">
                  ➕ New Admin
                </Link>
              </li>
            )}

            {/* 👤 User Auth Links */}
            {isLoggedIn ? (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                {!hideUserLogin && (
                  <li className="nav-item me-2">
                    <Link className="btn btn-outline-light btn-sm" to="/login">
                      Login
                    </Link>
                  </li>
                )}
                {!hideUserRegister && (
                  <li className="nav-item">
                    <Link className="btn btn-light btn-sm" to="/user-register">
                      Register
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
