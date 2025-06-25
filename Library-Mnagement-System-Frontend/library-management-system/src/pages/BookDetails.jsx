import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role"); // ✅ Get role

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/books/all");
        const foundBook = response.data.find((b) => b.id === parseInt(id));
        setBook(foundBook);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleBorrow = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/borrow", {
        state: { title: book.title, cover: book.cover },
      });
    }
  };

  if (loading)
    return <h4 className="text-center mt-5">Loading book details...</h4>;
  if (!book) return <h4 className="text-center mt-5">❌ Book not found</h4>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container mt-5 flex-grow-1">
        <button
          className="btn btn-outline-secondary mb-4"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="row">
          <div className="col-md-4">
            <img
              src={book.cover}
              alt={book.title}
              className="img-fluid rounded shadow"
            />
          </div>

          <div className="col-md-8">
            <h2>{book.title}</h2>
            <h5 className="text-muted">by {book.author}</h5>
            <p className="mt-4">
              {book.description || "No description for this book."}
            </p>

            {/* ✅ Only show borrow button for logged-in users with user role */}
            {isLoggedIn && role === "user" && (
              <button className="btn btn-success mt-3" onClick={handleBorrow}>
                Borrow This Book
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookDetails;
