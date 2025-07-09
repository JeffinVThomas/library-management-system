import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import AlreadyBorrowedPopup from "../components/AlreadyBorrowedPopup";

const Borrow = function () {
  var location = useLocation();
  var navigate = useNavigate();

  var state = location.state || {};
  var title = state.title || "";
  var cover = state.cover || "";
  var bookId = state.bookId;

  var userId = localStorage.getItem("userId");
  var token = localStorage.getItem("token");
  var role = localStorage.getItem("role");

  var todayDate = new Date().toLocaleDateString("en-CA");

  const [bookTitle] = useState(title);
  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [alreadyBorrowedPopup, setAlreadyBorrowedPopup] = useState(false);

  // Redirect user to login if not authorized
  useEffect(
    function () {
      if (!token || role !== "user") {
        navigate("/user-login");
      }
    },
    [navigate, token, role]
  );

  // Set default borrow date to today
  useEffect(
    function () {
      setBorrowDate(todayDate);
    },
    [todayDate]
  );

  // Handler for form submission
  function handleSubmit(e) {
    e.preventDefault();

    if (!userId || !bookId) {
      alert("Missing user or book information.");
      return;
    }

    // Check borrow conditions using promise chaining
    checkAlreadyBorrowed(userId, bookId)
      .then(function (alreadyBorrowed) {
        if (alreadyBorrowed) {
          setAlreadyBorrowedPopup(true);
          return Promise.reject("Already borrowed");
        }
        return checkUserFineStatus(userId);
      })
      .then(function (fineStatus) {
        if (fineStatus.hasFine) {
          alert(
            "❌ You have an unpaid fine of ₹" +
              fineStatus.fineAmount +
              ". Please pay your fine before borrowing a new book."
          );
          navigate("/my-books");
          return Promise.reject("Unpaid fine");
        }
        return submitBorrowRequest(userId, bookId, borrowDate, returnDate);
      })
      .then(function () {
        setShowModal(true);
      })
      .catch(function (error) {
        if (error !== "Already borrowed" && error !== "Unpaid fine") {
          console.error("Borrow request failed:", error);
          alert("Failed to submit borrow request. Please try again.");
        }
      });
  }

  // Function to check if user already borrowed the book
  function checkAlreadyBorrowed(userId, bookId) {
    return axios
      .get(
        "http://localhost:8080/api/borrow/user/" +
          userId +
          "/book/" +
          bookId +
          "/already-borrowed"
      )
      .then(function (response) {
        return response.data.alreadyBorrowed;
      });
  }

  // Function to check user's fine status
  function checkUserFineStatus(userId) {
    return axios
      .get("http://localhost:8080/api/borrow/fine-status/" + userId)
      .then(function (response) {
        return response.data;
      });
  }

  // Function to submit borrow request
  function submitBorrowRequest(userId, bookId, borrowDate, returnDate) {
    return axios.post(
      "http://localhost:8080/api/borrow/user/" + userId + "/book/" + bookId,
      {
        borrowDate: borrowDate,
        returnDate: returnDate,
      }
    );
  }

  // Handler to close success modal
  function handleModalClose() {
    setShowModal(false);
    setBorrowDate(todayDate);
    setReturnDate("");
    navigate("/books");
  }

  // Handler for borrowDate input change
  function handleBorrowDateChange(e) {
    var newBorrowDate = e.target.value;
    setBorrowDate(newBorrowDate);
    if (returnDate < newBorrowDate) {
      setReturnDate("");
    }
  }

  // Handler for returnDate input change
  function handleReturnDateChange(e) {
    setReturnDate(e.target.value);
  }

  // Handler for closing Already Borrowed popup
  function handleAlreadyBorrowedClose() {
    setAlreadyBorrowedPopup(false);
    navigate("/my-books");
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container mt-5 flex-grow-1">
        <h3 className="mb-4 text-center">📖 Borrow Book</h3>

        <div className="row g-4">
          {/* Left Side: Book Cover */}
          <div className="col-md-4">
            {cover && (
              <div className="card shadow-sm h-100 text-center">
                <img
                  src={cover}
                  alt={bookTitle}
                  className="card-img-top"
                  style={{ height: "450px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title mb-0">{bookTitle}</h5>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Borrow Form */}
          <div className="col-md-8 col-lg-6">
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
              <div className="mb-3">
                <label className="form-label">Borrow Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={borrowDate}
                  min={todayDate}
                  onChange={handleBorrowDateChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Return Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={returnDate}
                  min={borrowDate || todayDate}
                  onChange={handleReturnDateChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success w-100">
                Submit Borrow Request
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Borrow Success Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">✅ Borrow Request Sent</h5>
              </div>
              <div className="modal-body">
                <p>
                  Your request to borrow <strong>"{bookTitle}"</strong> has been
                  submitted!
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleModalClose}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Already Borrowed Popup */}
      {alreadyBorrowedPopup && (
        <AlreadyBorrowedPopup onClose={handleAlreadyBorrowedClose} />
      )}

      <Footer />
    </div>
  );
};

export default Borrow;
