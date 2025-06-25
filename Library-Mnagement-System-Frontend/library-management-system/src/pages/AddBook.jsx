import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

const AddBook = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      navigate("/admin-login");
    }
  }, [navigate]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(true); // default true

  const handleAddBook = async (e) => {
    e.preventDefault();

    try {
      const newBook = {
        title,
        author,
        category,
        cover,
        available, // important if your backend filters available books
        description,
      };

      await axios.post("http://localhost:8080/api/books", newBook);
      alert("✅ Book added successfully!");
      navigate("/manage-books");
    } catch (error) {
      console.error("Error adding book:", error);
      alert("❌ Failed to add book. Try again.");
    }
  };

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
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Author</label>
            <input
              type="text"
              className="form-control"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Cover Image URL</label>
            <input
              type="text"
              className="form-control"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              required
            />
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="availableCheck"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
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
