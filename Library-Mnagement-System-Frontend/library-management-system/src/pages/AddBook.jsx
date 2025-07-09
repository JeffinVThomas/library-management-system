import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

const AddBook = function () {
  const navigate = useNavigate();

  // useEffect to check admin auth on component mount
  useEffect(
    function () {
      var token = localStorage.getItem("token");
      var role = localStorage.getItem("role");
      if (!token || role !== "admin") {
        navigate("/admin-login");
      }
    },
    [navigate]
  );

  // State variables for book fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(true);
  const [availableCopies, setAvailableCopies] = useState(1); // default 1 copy

  // Handler function for form submit
  function handleAddBook(e) {
    e.preventDefault();

    var newBook = {
      title: title,
      author: author,
      category: category,
      cover: cover,
      available: available,
      description: description,
      availableCopies: availableCopies,
    };

    axios
      .post("http://localhost:8080/api/books", newBook)
      .then(function () {
        alert("✅ Book added successfully!");
        navigate("/manage-books");
      })
      .catch(function (error) {
        console.error("Error adding book:", error);
        alert("❌ Failed to add book. Try again.");
      });
  }

  // Event handler wrappers (to replace arrow functions)
  function onTitleChange(e) {
    setTitle(e.target.value);
  }
  function onAuthorChange(e) {
    setAuthor(e.target.value);
  }
  function onCategoryChange(e) {
    setCategory(e.target.value);
  }
  function onCoverChange(e) {
    setCover(e.target.value);
  }
  function onDescriptionChange(e) {
    setDescription(e.target.value);
  }
  function onAvailableCopiesChange(e) {
    // parseInt to convert string to number
    setAvailableCopies(parseInt(e.target.value));
  }
  function onAvailableCheckChange(e) {
    setAvailable(e.target.checked);
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="container py-5 flex-grow-1">
        <h3 className="text-center mb-4">📘 Add New Book</h3>

        <form
          onSubmit={handleAddBook}
          className="card p-4 shadow-sm mx-auto"
          style={{ maxWidth: "500px" }}
        >
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={onTitleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Author</label>
            <input
              type="text"
              className="form-control"
              value={author}
              onChange={onAuthorChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              value={category}
              onChange={onCategoryChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Cover Image URL</label>
            <input
              type="text"
              className="form-control"
              value={cover}
              onChange={onCoverChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={onDescriptionChange}
              rows="3"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Number of Copies</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={availableCopies}
              onChange={onAvailableCopiesChange}
              required
            />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="availableCheck"
              checked={available}
              onChange={onAvailableCheckChange}
            />
            <label className="form-check-label" htmlFor="availableCheck">
              Mark as Available
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Add Book
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AddBook;
