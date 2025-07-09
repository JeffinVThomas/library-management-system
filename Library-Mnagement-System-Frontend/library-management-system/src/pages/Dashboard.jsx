import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";

const Dashboard = function () {
  const [totalBooks, setTotalBooks] = useState(0);
  const [availableBooks, setAvailableBooks] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState(0);

  const isLoggedIn = localStorage.getItem("token") !== null;

  // ✅ Fetch stats on load
  useEffect(
    function () {
      // Fetch total books
      axios
        .get("http://localhost:8080/api/books/count")
        .then(function (response) {
          setTotalBooks(response.data);
        })
        .catch(function (error) {
          console.error("Error fetching total books:", error);
        });

      // Fetch available books
      axios
        .get("http://localhost:8080/api/books/count/available")
        .then(function (response) {
          setAvailableBooks(response.data);
        })
        .catch(function (error) {
          console.error("Error fetching available books:", error);
        });

      // Fetch borrowed books for logged-in users
      if (isLoggedIn) {
        axios
          .get("http://localhost:8080/api/borrow/count/borrowed", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then(function (response) {
            setBorrowedBooks(response.data);
          })
          .catch(function (error) {
            console.error("Error fetching borrowed books:", error);
          });
      }
    },
    [isLoggedIn]
  );

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#fdf6ee" }}
    >
      <div className="container text-center py-5 flex-grow-1">
        <img
          src="/logo.png"
          alt="Library Logo"
          style={{ width: "150px", marginBottom: "15px" }}
        />

        <h2 className="mb-2 fw-bold">Welcome to BookMate</h2>
        <h5 className="text-muted mb-4">
          — your gateway to timeless stories and learning —
        </h5>

        {/* 📊 Book Stats */}
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

            {isLoggedIn ? (
              <div className="col-sm-6 col-md-4">
                <div className="card text-white bg-danger h-100 shadow">
                  <div className="card-body">
                    <h5 className="card-title">Books Borrowed</h5>
                    <p className="card-text fs-4">{borrowedBooks}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* 🔗 Explore Actions */}
          <div className="mt-5">
            <h4 className="mb-3">Explore</h4>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/books" className="btn btn-outline-primary">
                📚 View Books
              </Link>
              {isLoggedIn ? (
                <Link to="/my-books" className="btn btn-outline-success">
                  📖Borrowed Books
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
