import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

const BookDetails = function () {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  var token = localStorage.getItem("token");
  var role = localStorage.getItem("role");
  var isLoggedIn = token ? true : false;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch book details on component mount or when id changes
  useEffect(
    function () {
      // Using promise-based axios call for simplicity
      axios
        .get("http://localhost:8080/api/books/all")
        .then(function (response) {
          // Find the book with matching id from the data
          var foundBook = response.data.find(function (b) {
            return b.id === parseInt(id);
          });

          setBook(foundBook);
          setLoading(false);
        })
        .catch(function (error) {
          console.error("Error fetching book:", error);
          setLoading(false);
        });
    },
    [id]
  );

  // Handler for Borrow button click
  function handleBorrow() {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/borrow", {
        state: {
          title: book.title,
          cover: book.cover,
          bookId: book.id,
        },
      });
    }
  }

  // Handler for Back button click
  function handleBackClick() {
    navigate(-1);
  }

  if (loading) {
    return <h4 className="text-center mt-5">Loading book details...</h4>;
  }

  if (!book) {
    return <h4 className="text-center mt-5">❌ Book not found</h4>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container mt-5 flex-grow-1">
        <button
          className="btn btn-outline-secondary mb-4"
          onClick={handleBackClick}
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

            <p className="mt-3 mb-2">
              <strong>Available Copies:</strong> {book.availableCopies}
            </p>

            <p className="mt-2">
              {book.description || "No description for this book."}
            </p>

            {isLoggedIn && role === "user" && (
              <div className="mt-3">
                {book.available ? (
                  <button className="btn btn-success" onClick={handleBorrow}>
                    Borrow
                  </button>
                ) : (
                  <button className="btn btn-secondary" disabled>
                    Currently Not Available
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookDetails;
