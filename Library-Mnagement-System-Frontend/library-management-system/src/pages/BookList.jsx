import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import LoginPopup from "../components/LoginPopup";

const BookList = function () {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [setRedirectToBookId] = useState(null);

  const navigate = useNavigate();
  var token = localStorage.getItem("token");
  var role = localStorage.getItem("role");
  var isLoggedIn = !!token;

  // Fetch available books on component mount
  useEffect(function () {
    axios
      .get("http://localhost:8080/api/books/available")
      .then(function (response) {
        var allBooks = response.data;
        var grouped = [];
        var map = new Map();

        // Group books by title-author to avoid duplicates
        allBooks.forEach(function (book) {
          var key = book.title + "-" + book.author;
          if (!map.has(key)) {
            map.set(key, true);
            grouped.push(book);
          }
        });

        setBooks(grouped);
      })
      .catch(function (error) {
        console.error("Error fetching books", error);
      });
  }, []);

  // Fetch categories on component mount
  useEffect(function () {
    axios
      .get("http://localhost:8080/api/books/categories")
      .then(function (res) {
        setCategories(["All"].concat(res.data));
      })
      .catch(function (err) {
        console.error("Error fetching categories", err);
      });
  }, []);

  // Handler when Details button clicked
  function handleDetailsClick(bookId) {
    if (!isLoggedIn) {
      setRedirectToBookId(bookId);
      setShowLoginPopup(true);
    } else {
      navigate("/books/" + bookId);
    }
  }

  // Handler when LoginPopup is closed
  function handlePopupClose() {
    setShowLoginPopup(false);
  }

  // Handler for category dropdown change
  function handleCategoryChange(e) {
    setSelectedCategory(e.target.value);
  }

  // Filter books based on selected category
  var filteredBooks = books.filter(function (book) {
    return selectedCategory === "All" || book.category === selectedCategory;
  });

  // Render each book card (used instead of inline map callback)
  function renderBookCard(book) {
    return (
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
            <p className="card-text text-muted mb-1">{book.author}</p>
            {/* Available copies */}
            <p className="card-text small text-secondary">
              Available Copies: {book.availableCopies}
            </p>

            <div className="mt-auto">
              <button
                className="btn btn-outline-primary btn-sm me-2"
                onClick={function () {
                  handleDetailsClick(book.id);
                }}
              >
                Details
              </button>

              {isLoggedIn && role === "user" ? (
                book.available ? (
                  <Link
                    to="/borrow"
                    state={{
                      title: book.title,
                      cover: book.cover,
                      bookId: book.id,
                    }}
                    className="btn btn-outline-success btn-sm"
                  >
                    Borrow
                  </Link>
                ) : (
                  <button className="btn btn-secondary btn-sm" disabled>
                    Not Available
                  </button>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="container py-5 flex-grow-1">
        <h2 className="mb-4">📚 Available Books</h2>

        <div className="mb-4">
          <label className="form-label me-2">Category:</label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="form-select"
            style={{ maxWidth: "300px" }}
          >
            {categories.map(function (cat) {
              return <option key={cat}>{cat}</option>;
            })}
          </select>
        </div>

        <div className="row g-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map(renderBookCard)
          ) : (
            <p>No books found in this category.</p>
          )}
        </div>
      </main>

      <Footer />

      {showLoginPopup && <LoginPopup onClose={handlePopupClose} />}
    </div>
  );
};

export default BookList;
