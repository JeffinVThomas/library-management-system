import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserRegister() {
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

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleEmailChange(e) {
    const value = e.target.value;
    setEmail(value);
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(pattern.test(value) ? "" : "Invalid email format");
  }

  function handleMobileChange(e) {
    const value = e.target.value;
    setMobile(value);
    const pattern = /^[6-9]\d{9}$/;
    setMobileError(pattern.test(value) ? "" : "Invalid Indian mobile number");
  }

  function handlePasswordChange(e) {
    const value = e.target.value;
    setPassword(value);
    const pattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;
    setPasswordError(
      pattern.test(value)
        ? ""
        : "Min 8 chars, include uppercase, number & special char"
    );
  }

  function handleConfirmChange(e) {
    const value = e.target.value;
    setConfirm(value);
    setConfirmError(value === password ? "" : "Passwords do not match");
  }

  async function handleUserRegister(e) {
    e.preventDefault();

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
        password: password,
        mobile: mobile,
        role: "user",
      });

      alert("✅ User registered successfully. Please login.");
      navigate("/login");
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
        <h3 className="text-center mb-4 text-dark">User Registration</h3>

        <form onSubmit={handleUserRegister} noValidate>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className={"form-control" + (emailError ? " is-invalid" : "")}
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && <small className="text-danger">{emailError}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              className={"form-control" + (mobileError ? " is-invalid" : "")}
              value={mobile}
              onChange={handleMobileChange}
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
              className={"form-control" + (passwordError ? " is-invalid" : "")}
              value={password}
              onChange={handlePasswordChange}
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
              className={"form-control" + (confirmError ? " is-invalid" : "")}
              value={confirm}
              onChange={handleConfirmChange}
              required
            />
            {confirmError && (
              <small className="text-danger">{confirmError}</small>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register as User
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserRegister;
