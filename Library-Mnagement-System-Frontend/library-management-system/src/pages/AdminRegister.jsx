import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const navigate = useNavigate();

  // ✅ Validations
  const validateEmail = (value) => {
    setEmail(value);
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(pattern.test(value) ? "" : "Invalid email format");
  };

  const validateMobile = (value) => {
    setMobile(value);
    const pattern = /^[6-9]\d{9}$/;
    setMobileError(pattern.test(value) ? "" : "Invalid Indian mobile number");
  };

  const validatePassword = (value) => {
    setPassword(value);
    const pattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;
    setPasswordError(
      pattern.test(value)
        ? ""
        : "Min 8 chars, include uppercase, number & special char"
    );
  };

  const validateConfirm = (value) => {
    setConfirm(value);
    setConfirmError(value === password ? "" : "Passwords do not match");
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();

    if (emailError || mobileError || passwordError || confirmError) {
      alert("❌ Please fix the errors before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/users/register", {
        name,
        email,
        password,
        mobile,
        role: "admin",
      });

      alert("✅ Admin registered successfully. Please login.");
      navigate("/admin-login");
    } catch (error) {
      alert("❌ Registration failed. Email or mobile may already be used.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "450px" }}
      >
        <h3 className="text-center mb-4 text-dark">Admin Registration</h3>

        <form onSubmit={handleAdminRegister} noValidate>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              placeholder="Enter email"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
              required
            />
            {emailError && <small className="text-danger">{emailError}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              className={`form-control ${mobileError ? "is-invalid" : ""}`}
              placeholder="Enter 10-digit mobile number"
              value={mobile}
              onChange={(e) => validateMobile(e.target.value)}
              required
            />
            {mobileError && (
              <small className="text-danger">{mobileError}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              placeholder="Create password"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
              required
            />
            {passwordError && (
              <small className="text-danger">{passwordError}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-control ${confirmError ? "is-invalid" : ""}`}
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => validateConfirm(e.target.value)}
              required
            />
            {confirmError && (
              <small className="text-danger">{confirmError}</small>
            )}
          </div>

          <button type="submit" className="btn btn-dark w-100">
            Register as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
