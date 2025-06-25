import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const isLoggedIn = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const hideUserLogin = location.pathname === "/login";
  const hideUserRegister = location.pathname === "/register";
  const hideAdminLogin = location.pathname === "/admin-login";
  const hideAdminRegister = location.pathname === "/admin-register";

  // ✅ Whether to show Admin Dashboard link in navbar
  const showAdminDashboardLink =
    isLoggedIn && role === "admin" && location.pathname !== "/admin-dashboard";

  // ✅ Whether to show User Dashboard link in navbar
  const showUserDashboardLink =
    isLoggedIn && role === "user" && location.pathname !== "/";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link
          className="navbar-brand"
          to={role === "admin" ? "/admin-dashboard" : "/"}
        >
          📚 LibrarySystem
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

            {/* ✅ Only for logged-in users */}
            {isLoggedIn && role === "user" && (
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
            )}

            {/* ✅ Admin dashboard link in other admin pages */}
            {showAdminDashboardLink && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin-dashboard">
                  Admin Dashboard
                </Link>
              </li>
            )}

            {/* ✅ User dashboard link in other user pages */}
            {showUserDashboardLink && (
              <li className="nav-item">
                <Link className="nav-link" to="/user-dashboard">
                  User Dashboard
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {/* Auth buttons for Admin */}
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
            {!isLoggedIn && !hideAdminRegister && (
              <li className="nav-item me-3">
                <Link className="btn btn-warning btn-sm" to="/admin-register">
                  Admin Register
                </Link>
              </li>
            )}

            {/* Auth buttons for Users */}
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
};

export default Navbar;
