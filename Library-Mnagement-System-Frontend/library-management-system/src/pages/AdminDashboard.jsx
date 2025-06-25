import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [totalBooks, setTotalBooks] = useState(0);
  const [availableBooks, setAvailableBooks] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/admin-login", { replace: true });
    } else {
      fetchBookCounts();
    }

    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const fetchBookCounts = async () => {
    try {
      const [totalRes, availableRes] = await Promise.all([
        axios.get("http://localhost:8080/api/books/count"),
        axios.get("http://localhost:8080/api/books/count/available"),
      ]);
      setTotalBooks(totalRes.data);
      setAvailableBooks(availableRes.data);
    } catch (error) {
      console.error("Failed to fetch book counts", error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="container py-5 flex-grow-1">
        <h2 className="mb-5 text-center">🛠️ Admin Dashboard</h2>

        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <div className="row g-4 justify-content-center w-100 mb-4">
            <div className="col-sm-6 col-md-4">
              <div className="card text-white bg-primary shadow h-100">
                <div className="card-body">
                  <h5 className="card-title">Total Books</h5>
                  <p className="fs-4">{totalBooks}</p>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <div className="card text-white bg-success shadow h-100">
                <div className="card-body">
                  <h5 className="card-title">Available Books</h5>
                  <p className="fs-4">{availableBooks}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h5 className="mb-3">Library Management</h5>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/add-book" className="btn btn-outline-primary">
                ➕ Add New Book
              </Link>
              <Link to="/manage-books" className="btn btn-outline-secondary">
                🗂️ Manage Books
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
