import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";

const MyBooks = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/user-login");
    }
  }, [navigate, token, role]);

  // ✅ Fetch borrowed books from DB
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8080/api/borrow/user/${userId}`)
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

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#fdf6ee", padding: "20px" }}
    >
      <h3 className="mb-4">📚 My Borrowed Books</h3>

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
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.book?.title || "N/A"}</td>
                  <td>{entry.borrowDate || "N/A"}</td>
                  <td>{entry.returnDate || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyBooks;
