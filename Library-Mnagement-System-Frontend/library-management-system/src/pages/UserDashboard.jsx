import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

// User Dashboard Component
function UserDashboard() {
  const navigate = useNavigate();

  useEffect(
    function () {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const shouldRefresh =
        sessionStorage.getItem("refreshUserDashboard") === "true";

      // ✅ Refresh page once after login to fetch fresh session data
      if (shouldRefresh) {
        sessionStorage.removeItem("refreshUserDashboard");

        setTimeout(function () {
          window.location.reload();
        }, 100);

        return;
      }

      // ✅ Redirect to login if token missing or role not user
      if (!token || role !== "user") {
        navigate("/login", { replace: true });
        return;
      }

      // ✅ Token validation with backend
      fetch("http://localhost:8080/api/users/validate-token", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (res) {
          if (!res.ok) {
            localStorage.clear();
            navigate("/login", { replace: true });
          }
        })
        .catch(function () {
          localStorage.clear();
          navigate("/login", { replace: true });
        });

      // ✅ Prevent browser back navigation
      window.history.pushState(null, "", window.location.href);
      function blockBack() {
        window.history.pushState(null, "", window.location.href);
      }

      window.addEventListener("popstate", blockBack);
      return function () {
        window.removeEventListener("popstate", blockBack);
      };
    },
    [navigate]
  );

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#fdf6ee" }}
    >
      <div className="container flex-grow-1 d-flex flex-column justify-content-center py-5">
        <h2 className="text-center mb-5 fw-bold" style={{ color: "#34495e" }}>
          👋Dashboard
        </h2>

        <div className="row g-4 justify-content-center">
          <div className="col-sm-6 col-md-4">
            <div className="card text-center h-100 shadow border-0">
              <div className="card-body">
                <h5 className="card-title">📚 View All Books</h5>
                <p className="card-text text-muted">
                  Browse all available books in the library.
                </p>
                <Link to="/books" className="btn btn-outline-primary">
                  Go to Books
                </Link>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-md-4">
            <div className="card text-center h-100 shadow border-0">
              <div className="card-body">
                <h5 className="card-title">📒 My Borrowed Books</h5>
                <p className="card-text text-muted">
                  View your currently borrowed books.
                </p>
                <Link to="/my-books" className="btn btn-outline-dark">
                  View My Books
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default UserDashboard;
