import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ✅ Fetch books
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/books/available")
      .then((response) => setBooks(response.data))
      .catch((error) => console.error("Error fetching books", error));
  }, []);

  // ✅ Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/books/categories")
      .then((res) => setCategories(["All", ...res.data]))
      .catch((err) => console.error("Error fetching categories", err));
  }, []);

  const filteredBooks =
    selectedCategory === "All"
      ? books
      : books.filter((book) => book.category === selectedCategory);

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="container py-5 flex-grow-1">
        <h2 className="mb-4">📚 Available Books</h2>

        {/* ✅ Category Filter */}
        <div className="mb-4">
          <label className="form-label me-2">Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
            style={{ maxWidth: "300px" }}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* ✅ Book Grid */}
        <div className="row g-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div className="col-sm-6 col-md-4" key={book.id}>
                <div
                  className="card h-100 shadow-sm"
                  style={{ maxWidth: "280px", margin: "0 auto" }}
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text text-muted">{book.author}</p>

                    <div className="mt-auto">
                      <Link
                        to={`/books/${book.id}`}
                        className="btn btn-outline-primary btn-sm me-2"
                      >
                        Details
                      </Link>

                      {isLoggedIn && role === "user" && (
                        <Link
                          to="/borrow"
                          state={{
                            title: book.title,
                            cover: book.cover,
                            bookId: book.id, // ✅ Important: pass bookId
                          }}
                          className="btn btn-outline-success btn-sm"
                        >
                          Borrow
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No books found in this category.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookList;
