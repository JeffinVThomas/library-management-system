import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminRegister() {
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

  // ✅ Email validation
  function validateEmail(value) {
    setEmail(value);
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (pattern.test(value)) {
      setEmailError("");
    } else {
      setEmailError("Invalid email format");
    }
  }

  // ✅ Mobile number validation (Indian format)
  function validateMobile(value) {
    setMobile(value);
    const pattern = /^[6-9]\d{9}$/;
    if (pattern.test(value)) {
      setMobileError("");
    } else {
      setMobileError("Invalid Indian mobile number");
    }
  }

  // ✅ Password strength validation
  function validatePassword(value) {
    setPassword(value);
    const pattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    if (pattern.test(value)) {
      setPasswordError("");
    } else {
      setPasswordError("Min 8 chars, include uppercase, number & special char");
    }
  }

  // ✅ Confirm password match
  function validateConfirm(value) {
    setConfirm(value);
    if (value === password) {
      setConfirmError("");
    } else {
      setConfirmError("Passwords do not match");
    }
  }

  // ✅ Submit handler
  async function handleAdminRegister(e) {
    e.preventDefault();

    // Block submission if validation errors exist
    if (
      emailError !== "" ||
      mobileError !== "" ||
      passwordError !== "" ||
      confirmError !== ""
    ) {
      alert("❌ Please fix the errors before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/users/register", {
        name: name,
        email: email,
        mobile: mobile,
        password: password,
        role: "admin",
      });

      alert("✅ Admin registered successfully. Please login.");
      navigate("/admin-login");
    } catch (error) {
      alert("❌ Registration failed. Email or mobile may already be used.");
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "450px" }}
      >
        <h3 className="text-center mb-4 text-dark">Admin Registration</h3>

        <form onSubmit={handleAdminRegister} noValidate>
          {/* Name Field */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={function (e) {
                setName(e.target.value);
              }}
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              className={"form-control" + (emailError ? " is-invalid" : "")}
              value={email}
              onChange={function (e) {
                validateEmail(e.target.value);
              }}
              required
            />
            {emailError && <small className="text-danger">{emailError}</small>}
          </div>

          {/* Mobile Field */}
          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              className={"form-control" + (mobileError ? " is-invalid" : "")}
              value={mobile}
              onChange={function (e) {
                validateMobile(e.target.value);
              }}
              required
            />
            {mobileError && (
              <small className="text-danger">{mobileError}</small>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={"form-control" + (passwordError ? " is-invalid" : "")}
              value={password}
              onChange={function (e) {
                validatePassword(e.target.value);
              }}
              required
            />
            {passwordError && (
              <small className="text-danger">{passwordError}</small>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className={"form-control" + (confirmError ? " is-invalid" : "")}
              value={confirm}
              onChange={function (e) {
                validateConfirm(e.target.value);
              }}
              required
            />
            {confirmError && (
              <small className="text-danger">{confirmError}</small>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-dark w-100">
            Register as Admin
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminRegister;
