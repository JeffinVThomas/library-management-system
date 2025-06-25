import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../components/Footer";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/books/all"); // Fetch all books
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Delete book by ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/books/${id}`);
      setBooks(books.filter((book) => book.id !== id)); // Update state after deletion
      alert("❌ Book deleted");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container py-5 flex-grow-1">
        <h2 className="mb-4">📚 Manage Books</h2>

        {loading ? (
          <p>Loading books...</p>
        ) : books.length === 0 ? (
          <p>No books available.</p>
        ) : (
          <div className="row g-4">
            {books.map((book) => (
              <div className="col-sm-6 col-md-4" key={book.id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text text-muted">{book.author}</p>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ManageBooks;
