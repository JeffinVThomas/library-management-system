import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const UserDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // 🚫 Block access to dashboard if not logged in or role mismatch
    if (!token || role !== "user") {
      navigate("/login", { replace: true });
    }

    // ✅ This ensures that back button doesn't return to login
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#fdf6ee" }}
    >
      <div className="container flex-grow-1 d-flex flex-column justify-content-center py-5">
        <h2 className="text-center mb-5 fw-bold" style={{ color: "#34495e" }}>
          👋 Welcome to Your Library Dashboard
        </h2>

        <div className="row g-4 justify-content-center">
          <div className="col-sm-6 col-md-4">
            <div
              className="card text-center h-100 shadow border-0"
              style={{ borderRadius: "15px", transition: "transform 0.2s" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
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
            <div
              className="card text-center h-100 shadow border-0"
              style={{ borderRadius: "15px", transition: "transform 0.2s" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
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
};

export default UserDashboard;
