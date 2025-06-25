import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";

const Dashboard = () => {
  const [totalBooks, setTotalBooks] = useState(0);
  const [availableBooks, setAvailableBooks] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState(0);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/books/count")
      .then((res) => setTotalBooks(res.data));
    axios
      .get("http://localhost:8080/api/books/count/available")
      .then((res) => setAvailableBooks(res.data));

    if (isLoggedIn) {
      axios
        .get("http://localhost:8080/api/books/count/borrowed")
        .then((res) => setBorrowedBooks(res.data));
    }
  }, [isLoggedIn]);

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#fdf6ee" }}
    >
      <div className="container text-center py-5 flex-grow-1">
        {/* ✅ Logo and heading stay at top */}
        <img
          src="/logo.png"
          alt="Library Logo"
          style={{ width: "120px", marginBottom: "20px" }}
        />
        <h2 className="mb-4 fw-bold">
          Welcome to the Library Management System
        </h2>

        {/* ✅ Center only cards and buttons vertically */}
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <div className="row justify-content-center g-4 w-100">
            <div className="col-sm-6 col-md-4">
              <div className="card text-white bg-primary h-100 shadow">
                <div className="card-body">
                  <h5 className="card-title">Total Books</h5>
                  <p className="card-text fs-4">{totalBooks}</p>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <div className="card text-white bg-success h-100 shadow">
                <div className="card-body">
                  <h5 className="card-title">Books Available</h5>
                  <p className="card-text fs-4">{availableBooks}</p>
                </div>
              </div>
            </div>

            {isLoggedIn && (
              <div className="col-sm-6 col-md-4">
                <div className="card text-white bg-danger h-100 shadow">
                  <div className="card-body">
                    <h5 className="card-title">Books Borrowed</h5>
                    <p className="card-text fs-4">{borrowedBooks}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ✅ Buttons below cards */}
          <div className="mt-5">
            <h4 className="mb-3">Quick Access</h4>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/books" className="btn btn-outline-primary">
                📚 View All Books
              </Link>

              {isLoggedIn && (
                <Link to="/my-books" className="btn btn-outline-success">
                  📖 My Borrowed Books
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
