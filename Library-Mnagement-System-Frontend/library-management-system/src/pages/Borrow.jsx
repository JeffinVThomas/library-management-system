import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";

const Borrow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, cover, bookId } = location.state || {};

  const [bookTitle, setBookTitle] = useState(title || "");
  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "user") {
      navigate("/user-login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !bookId) {
      alert("Missing user or book information.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/borrow/user/${userId}/book/${bookId}`,
        {
          borrowDate,
          returnDate,
        }
      );
      setShowModal(true);
    } catch (error) {
      console.error("Borrow request failed:", error);
      alert("Failed to submit borrow request. Please try again.");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setBorrowDate("");
    setReturnDate("");
    navigate("/books");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container mt-5 flex-grow-1">
        <h3 className="mb-4 text-center">📖 Borrow a Book</h3>

        <div className="row g-4">
          {/* Left: Book Info */}
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

          {/* Right: Form */}
          <div className="col-md-8 col-lg-6">
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
              <div className="mb-3">
                <label className="form-label">Borrow Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={borrowDate}
                  onChange={(e) => setBorrowDate(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Return Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
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

      {/* Modal */}
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
                  Your request to borrow <strong>"{bookTitle}"</strong> has been submitted!
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

      <Footer />
    </div>
  );
};

export default Borrow;
