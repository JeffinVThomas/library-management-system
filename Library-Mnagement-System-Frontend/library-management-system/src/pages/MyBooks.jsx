import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";

const MyBooks = function () {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // State to store borrowed books fetched from backend
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  // Loading indicator for fetch requests
  const [loading, setLoading] = useState(true);
  // State and controls for showing the fine popup modal
  const [showFinePopup, setShowFinePopup] = useState(false);
  const [selectedFineBook, setSelectedFineBook] = useState(null);
  const [fineAmount, setFineAmount] = useState(0);

  // Redirect to login if user not logged in or role not "user"
  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/user-login");
    }
  }, [navigate, token, role]);

  // Fetch borrowed books when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/api/borrow/user/${userId}?t=${Date.now()}`)
        .then((response) => {
          setBorrowedBooks(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching borrowed books:", error);
          setBorrowedBooks([]);
          setLoading(false);
        });
    }
  }, [userId]);

  // Handles returning a borrowed book
  function handleReturn(borrowId) {
    axios
      .put("http://localhost:8080/api/borrow/return/" + borrowId)
      .then((response) => {
        console.log("✅ Return success:", response.data);
        // After a small delay, refresh the borrowed books list and alert user
        setTimeout(() => {
          if (userId) {
            axios
              .get(
                `http://localhost:8080/api/borrow/user/${userId}?t=${Date.now()}`
              )
              .then((res) => {
                setBorrowedBooks(res.data);
              });
          }
          alert(response.data.message || "Book returned successfully.");
        }, 1000);
      })
      .catch((error) => {
        console.error("❌ Error returning book:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          alert("❌ Failed to return book: " + error.response.data.message);
        } else {
          alert("❌ Failed to return book.");
        }
      });
  }

  // Handles cancelling a borrow request before borrow date
  function handleCancel(borrowId) {
    axios
      .put("http://localhost:8080/api/borrow/return/" + borrowId)
      .then((response) => {
        console.log("🟡 Cancelled:", response.data);
        setTimeout(() => {
          if (userId) {
            axios
              .get(
                `http://localhost:8080/api/borrow/user/${userId}?t=${Date.now()}`
              )
              .then((res) => {
                setBorrowedBooks(res.data);
              });
          }
          alert("🟡 Borrow cancelled successfully.");
        }, 1000);
      })
      .catch((error) => {
        console.error("❌ Cancel failed:", error);
        alert("❌ Failed to cancel borrow.");
      });
  }

  // When user clicks on "Fine" button to view fine amount popup
  function handleFineClick(borrowedBook) {
    axios
      .get("http://localhost:8080/api/borrow/fine/" + borrowedBook.id)
      .then((res) => {
        setFineAmount(res.data.fine);
        setSelectedFineBook(borrowedBook);
        setShowFinePopup(true);
      })
      .catch(() => {
        alert("Error calculating fine.");
      });
  }

  // Handles paying the fine and then returning the book
  function handlePayFine() {
    alert("✅ Fine paid successfully!");
    setShowFinePopup(false);
    if (selectedFineBook) {
      handleReturn(selectedFineBook.id);
      setSelectedFineBook(null);
    }
  }

  // Close the fine popup modal
  function handleClosePopup() {
    setShowFinePopup(false);
    setSelectedFineBook(null);
  }

  // Get the status string for each borrowed book entry
  function getBookStatus(entry) {
    const today = new Date().toISOString().split("T")[0];
    const borrowDate = entry.borrowDate;
    const returnDate = entry.returnDate;

    if (entry.returned && entry.status === "Borrow Cancelled")
      return "❌ Borrow Cancelled";
    if (entry.returned) return "✅ Returned";
    if (today < borrowDate) return "🕓 Borrow Pending";
    if (today > returnDate) return "⚠️ Fine Pending";
    return "⏳ Return Pending";
  }

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#fdf6ee" }}
    >
      <h3 className="mb-4">📚 Borrowed Books</h3>

      {loading ? (
        <p className="text-muted">Loading borrowed books...</p>
      ) : borrowedBooks.length === 0 ? (
        <p className="text-muted">You have not borrowed any books yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Book Title</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((entry, index) => {
                const status = getBookStatus(entry);

                return (
                  <tr key={entry.id}>
                    <td>{index + 1}</td>
                    <td>{entry.book?.title || "N/A"}</td>
                    <td>{entry.borrowDate || "N/A"}</td>
                    <td>{entry.returnDate || "N/A"}</td>
                    <td>{status}</td>
                    <td>
                      {!entry.returned && (
                        <>
                          {status === "⏳ Return Pending" && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleReturn(entry.id)}
                            >
                              Return
                            </button>
                          )}
                          {status === "⚠️ Fine Pending" && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleFineClick(entry)}
                            >
                              Fine
                            </button>
                          )}
                          {status === "🕓 Borrow Pending" && (
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => handleCancel(entry.id)}
                            >
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Fine Payment Popup Modal */}
      {showFinePopup && selectedFineBook && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Fine Payment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClosePopup}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Book: <strong>{selectedFineBook.book.title}</strong>
                </p>
                <p>
                  Due Date: <strong>{selectedFineBook.returnDate}</strong>
                </p>
                <p className="text-danger fs-5">
                  Fine Amount: ₹{fineAmount} (₹10 per day)
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={handlePayFine}>
                  Pay Fine
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleClosePopup}
                >
                  Cancel
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

export default MyBooks;
