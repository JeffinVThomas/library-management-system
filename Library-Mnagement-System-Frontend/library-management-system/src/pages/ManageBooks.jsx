import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../components/Footer";

const ManageBooks = function () {
  // State to hold list of books fetched from backend
  const [books, setBooks] = useState([]);

  // State to show loading message while fetching
  const [loading, setLoading] = useState(true);

  // useEffect to fetch books only once when component mounts
  useEffect(function () {
    fetchBooks();
  }, []);

  // Function to fetch all books from backend API
  function fetchBooks() {
    axios
      .get("http://localhost:8080/api/books/all")
      .then(function (response) {
        // Update state with books data and stop loading
        setBooks(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }

  // Function to remove one copy of a book by id
  function handleDelete(id) {
    axios
      .put("http://localhost:8080/api/books/" + id + "/decrement-copy")
      .then(function () {
        // Refresh the list after successful update
        fetchBooks();
        alert("📉 One copy removed successfully");
      })
      .catch(function (error) {
        console.error("Error updating book:", error);
        alert("Failed to remove a copy");
      });
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container py-5 flex-grow-1">
        <h2 className="mb-4">📚 Manage Books</h2>

        {loading ? (
          // Show loading text while fetching books
          <p>Loading books...</p>
        ) : books.length === 0 ? (
          // Show this if no books are available
          <p>No books available.</p>
        ) : (
          // Show list of books in a responsive grid
          <div className="row g-4">
            {books.map(function (book) {
              // Render each book inside a card
              return (
                <div className="col-sm-6 col-md-4" key={book.id}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{book.title}</h5>
                      <p className="card-text text-muted">{book.author}</p>
                      <p className="card-text">
                        <strong>Copies:</strong> {book.availableCopies}
                      </p>
                      <div className="mt-auto">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={function () {
                            handleDelete(book.id);
                          }}
                        >
                          Remove Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ManageBooks;
